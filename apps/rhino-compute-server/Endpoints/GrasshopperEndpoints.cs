using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;
using GH_IO.Serialization;
using Nancy;
using Nancy.Extensions;
using Nancy.Routing;
using NodePen.Converters;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Speckle.Core.Api;
using Speckle.Core.Credentials;
using Speckle.Core.Models;
using Speckle.Newtonsoft.Json;
using NJsonConvert = Newtonsoft.Json.JsonConvert;

namespace Rhino.Compute.Endpoints
{

  public class GrasshopperEndpointsModule : NancyModule
  {
    public GrasshopperEndpointsModule(IRouteCacheProvider routeCacheProvider)
    {
      Post["/files/gh"] = _ => HandleGrasshopperFileUpload(Context);
      Get["/grasshopper"] = _ => GetGrasshopperConfiguration();
      Post["/grasshopper/id/solution"] = _ => SolveGrasshopperDocument(Context);
    }

    private string SID(string id)
    {
      return $"[{NodePenConvert.TruncateId(id)}]";
    }

    private void Log(string prefix, string id, string message, int tabCount = 0)
    {
      return;
    }

    private void Log(string prefix, Guid id, string message, int tabCount = 0)
    {
      Log(prefix, id.ToString(), message, tabCount);
    }

    public class NodePenSolutionRequestBody
    {
      [JsonProperty("solutionId")]
      public string SolutionId { get; set; }

      [JsonProperty("document")]
      public NodePenDocument Document { get; set; }
    }

    public class NodePenDocumentSpeckleStreamData : Base
    {
      public NodePenDocument Document { get; set; }

      public NodePenDocumentSolutionData SolutionData { get; set; }

    }

    public Response SolveGrasshopperDocument(NancyContext context)
    {
      string body = context.Request.Body.AsString();
      NodePenSolutionRequestBody requestData = NJsonConvert.DeserializeObject<NodePenSolutionRequestBody>(body);

      Stopwatch timer = new Stopwatch();

      timer.Start();

      // Create Grasshopper document
      GH_Archive archive = NodePenConvert.Deserialize<GH_Archive>(requestData.Document);

      GH_Document definition = new GH_Document();
      _ = archive.ExtractObject(definition, "definition");

      Console.WriteLine(definition.ObjectCount);

      // Solve Grasshopper document
      definition.Enabled = true;
      definition.NewSolution(true, GH_SolutionMode.Silent);

      timer.Stop();

      // Extract solution data
      Log(">>", requestData.Document.Id, "Document");
      Log(" >", requestData.Document.Id, $"Created and solved document in {timer.ElapsedMilliseconds}ms");

      NodePenDocumentSolutionData documentSolutionData = new NodePenDocumentSolutionData()
      {
        SolutionId = requestData.SolutionId,
        // TODO: Actually collect manifest info
        SolutionManifest = new NodePenDocumentSolutionManifest()
        {
          RuntimeDurationMs = 0,
          RuntimeMessages = new Dictionary<string, string>()
        }
      };

      foreach (IGH_DocumentObject documentObject in definition.Objects)
      {
        switch (documentObject)
        {
          case IGH_Component componentInstance:
            {
              List<IGH_Param> componentParams = new List<IGH_Param>();
              componentParams.AddRange(componentInstance.Params.Input);
              componentParams.AddRange(componentInstance.Params.Output);

              foreach (IGH_Param componentParam in componentParams)
              {
                NodePenPortSolutionData portSolutionData = new NodePenPortSolutionData();

                for (int i = 0; i < componentParam.VolatileData.PathCount; i++)
                {
                  Grasshopper.Kernel.Data.GH_Path currentPath = componentParam.VolatileData.get_Path(i);
                  System.Collections.IList currentBranch = componentParam.VolatileData.get_Branch(currentPath);

                  string branchKey = $"{{{string.Join(";", currentPath.Indices.Select((idx) => idx.ToString()))}}}";

                  NodePenDataTreeBranch branchSolutionData = new NodePenDataTreeBranch()
                  {
                    Order = i,
                    Path = branchKey,
                  };

                  foreach (object entry in currentBranch)
                  {
                    if (!(entry is IGH_Goo goo))
                    {
                      // `goo` appears to be null, not absent, on invalid solutions
                      continue;
                    }

                    var entrySolutionData = Environment.Converter.ConvertToSpeckle(goo);
                    branchSolutionData.Values.Add(entrySolutionData);
                  }

                  portSolutionData.DataTree.Branches.Add(branchSolutionData);
                }

                portSolutionData.DataTree.ComputeStats();
                portSolutionData.DataTree.ComputeStructure();

                documentSolutionData.PortSolutionData.Add(portSolutionData);
              }

              break;
            }
          default:
            {
              Console.WriteLine($"Unhandled object type [{documentObject.GetType()}]");
              break;
            }
        }
      }

      // Commit updated document and solution data to stream
      string streamId = Environment.SpeckleStreamId;
      string branchName = "main";

      Account account = new Account()
      {
        token = Environment.SpeckleToken,
        serverInfo = new ServerInfo()
        {
          url = Environment.SpeckleEndpoint,
          company = "NodePen"
        },
        userInfo = new UserInfo()
        {
          email = "chuck@nodepen.io"
        }
      };

      var documentStreamData = new NodePenDocumentSpeckleStreamData()
      {
        Document = requestData.Document,
        SolutionData = documentSolutionData,
      };

      string commitId = Helpers.Send(
          stream: $"{Environment.SpeckleEndpoint}/streams/{streamId}/branches/{branchName}",
          data: documentStreamData,
          message: $"Solution ${SID(requestData.SolutionId)}",
          account: account,
          sourceApplication: "nodepen"
      ).Result;

      // Serialize and return response
      Client client = new Client(account);

      Branch streamBranch = client.BranchGet(streamId, branchName, 1).Result;

      Console.WriteLine("Solution:");

      foreach (Commit item in streamBranch.commits.items)
      {
        Console.WriteLine("Object:");
        Console.WriteLine(item.id);
        Console.WriteLine(item.referencedObject);
      }

      string rootObjectId = streamBranch.commits.items[0].referencedObject;

      return Response.AsText(rootObjectId);
    }

    public Response HandleGrasshopperFileUpload(NancyContext context)
    {
      HttpFile file = context.Request.Files.FirstOrDefault();

      if (file == null)
      {
        return Response.AsText("not ok");
      }

      byte[] fileBinary = new byte[file.Value.Length];
      _ = file.Value.Read(fileBinary, 0, (int)file.Value.Length);

      GH_Archive archive = new GH_Archive();
      _ = archive.Deserialize_Binary(fileBinary);

      GH_Document definition = new GH_Document();
      _ = archive.ExtractObject(definition, "Definition");

      NodePenDocument document = NodePenConvert.Serialize(definition);

      return Response.AsJson(document);
    }

    public Response GetGrasshopperConfiguration()
    {
      return Response.AsJson(NodePenConvert.Templates.Where((template) => !template.IsObsolete));
    }

  }

}