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
using Objects.Geometry;
using Speckle.Newtonsoft.Json;
using NJsonConvert = Newtonsoft.Json.JsonConvert;
using Rhino.Compute.Kits;
using Objects.Converter.RhinoGh;

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

    public class NodePenSolutionManifest
    {
      [JsonProperty("solutionId")]
      public string SolutionId { get; set; }

      [JsonProperty("solutionData")]
      public NodePenSolutionData SolutionData { get; set; }

      [JsonProperty("streamObjectIds")]
      public List<string> StreamObjectIds { get; set; } = new List<string>();
    }

    public class NodePenSolutionData : Base
    {
      [JsonProperty("id")]
      public string Id { get; set; }

      [JsonProperty("manifest")]
      public NodePenSolutionDataManifest Manifest { get; set; } = new NodePenSolutionDataManifest();

      [JsonProperty("values")]
      public Dictionary<string, Dictionary<string, NodePenDataTree>> Values { get; set; } = new Dictionary<string, Dictionary<string, NodePenDataTree>>();
    }

    public class NodePenSolutionDataManifest : Base
    {
      [JsonProperty("runtimeMessages")]
      public Dictionary<string, string> RuntimeMessages { get; set; } = new Dictionary<string, string>();

      [JsonProperty("streamObjectIds")]
      public List<string> StreamObjectIds = new List<string>();
    }

    public class NodePenDocumentStream : Base
    {
      public string Id { get; set; }

      public string Name { get; set; }

      [DetachProperty]
      public NodePenDocument Document { get; set; }

      [DetachProperty]
      public NodePenSolutionData SolutionData { get; set; }
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

      NodePenSolutionData solutionData = new NodePenSolutionData();

      foreach (IGH_DocumentObject documentObject in definition.Objects)
      {
        Log(">>", documentObject.InstanceGuid, "Document Object", 1);

        switch (documentObject)
        {
          case IGH_Component componentInstance:
            {
              Log(" >", componentInstance.InstanceGuid, "IGH_Component", 1);
              Log(" >", componentInstance.InstanceGuid, componentInstance.Name, 1);
              Dictionary<string, NodePenDataTree> componentSolutionData = new Dictionary<string, NodePenDataTree>();

              Log(" >", componentInstance.InstanceGuid, $"{componentInstance.Params.Input.Count} input params", 1);
              Log(" >", componentInstance.InstanceGuid, $"{componentInstance.Params.Output.Count} output params", 1);

              List<IGH_Param> componentParams = new List<IGH_Param>();
              componentParams.AddRange(componentInstance.Params.Input);
              componentParams.AddRange(componentInstance.Params.Output);

              foreach (IGH_Param componentParam in componentParams)
              {
                Log(">>", componentParam.InstanceGuid, "IGH_Param", 2);
                Log(" >", componentParam.InstanceGuid, $"Found {componentParam.VolatileData.PathCount} branch(es) of results.", 2);
                NodePenDataTree paramSolutionData = new NodePenDataTree();

                for (int i = 0; i < componentParam.VolatileData.PathCount; i++)
                {
                  Grasshopper.Kernel.Data.GH_Path currentPath = componentParam.VolatileData.get_Path(i);
                  System.Collections.IList currentBranch = componentParam.VolatileData.get_Branch(currentPath);

                  string branchKey = $"{{{string.Join(";", currentPath.Indices.Select((idx) => idx.ToString()))}}}";

                  Log(">>", branchKey, $"Branch with {currentBranch.Count} entries", 3);

                  List<NodePenDataTreeValue> branchSolutionData = new List<NodePenDataTreeValue>();

                  foreach (object entry in currentBranch)
                  {
                    if (!(entry is IGH_Goo goo))
                    {
                      // `goo` appears to be null, not absent, on invalid solutions
                      continue;
                    }

                    var converter = new NodePenRhinoConverter();

                    Console.WriteLine(goo.TypeName);

                    switch (goo.TypeName)
                    {
                      case "Circle":
                        {
                          GH_Circle circleGoo = goo as GH_Circle;
                          Geometry.Circle circle = circleGoo.Value;

                          Console.WriteLine(JsonConvert.SerializeObject(circle));

                          var res = converter.ConvertToSpeckle(circle);

                          Console.WriteLine(JsonConvert.SerializeObject(res));

                          var baseConverter = new ConverterRhinoGh();

                          var circleRes = baseConverter.CircleToSpeckle(circle);
                          Console.WriteLine("Circle res:");
                          Console.WriteLine(circleRes);
                          Console.WriteLine(JsonConvert.SerializeObject(circleRes));

                          NodePenDataTreeValue entrySolutionData = new NodePenDataTreeValue()
                          {
                            Type = "circle"
                          };

                          entrySolutionData["Value"] = res;

                          branchSolutionData.Add(entrySolutionData);

                          break;
                        }
                      case "Curve":
                        {
                          Log(" >", branchKey, "Curve", 3);

                          GH_Curve curveGoo = goo as GH_Curve;
                          Geometry.Curve curve = curveGoo.Value;

                          List<double> coords = new List<double>
                          {
                            curve.PointAtStart.X,
                            curve.PointAtStart.Y,
                            curve.PointAtStart.Z
                          };

                          for (int z = 0; z < curve.SpanCount; z++)
                          {
                            Geometry.Interval span = curve.SpanDomain(z);

                            Geometry.Point3d pt = curve.PointAt(span.Max);

                            coords.Add(pt.X);
                            coords.Add(pt.Y);
                            coords.Add(pt.Z);
                          }

                          Polyline displayValue = new Polyline(coords);

                          NodePenDataTreeValue entrySolutionData = new NodePenDataTreeValue()
                          {
                            Type = "curve"
                          };

                          // entrySolutionData["Value"] = curve.ToJSON(new FileIO.SerializationOptions());
                          entrySolutionData["Value"] = curve.ToJSON(new FileIO.SerializationOptions());
                          entrySolutionData["displayValue"] = displayValue;

                          branchSolutionData.Add(entrySolutionData);

                          break;
                        }
                      case "Integer":
                        {
                          Log(" >", branchKey, "Integer", 3);

                          GH_Integer integerGoo = goo as GH_Integer;
                          int integer = integerGoo.Value;

                          NodePenDataTreeValue entrySolutionData = new NodePenDataTreeValue()
                          {
                            Type = "integer",
                            Value = integer
                          };

                          branchSolutionData.Add(entrySolutionData);

                          break;
                        }
                      case "Number":
                        {
                          Log(" >", branchKey, "Number", 3);

                          GH_Number numberGoo = goo as GH_Number;
                          double number = numberGoo.Value;

                          NodePenDataTreeValue entrySolutionData = new NodePenDataTreeValue()
                          {
                            Type = "number",
                            Value = number
                          };

                          branchSolutionData.Add(entrySolutionData);

                          break;
                        }
                      default:
                        {
                          Log("!>", branchKey, $"Unhandled value type [{goo.TypeName}]", 3);

                          NodePenDataTreeValue entrySolutionData = new NodePenDataTreeValue()
                          {
                            Type = goo.TypeName.ToLower(),
                            Value = NJsonConvert.SerializeObject(goo)
                          };

                          branchSolutionData.Add(entrySolutionData);

                          break;
                        }
                    }
                  }

                  paramSolutionData.Add(branchKey, branchSolutionData);
                  Log("--", branchKey, $"Wrote {branchSolutionData.Count} items to branch solution data.", 3);
                }

                componentSolutionData.Add(componentParam.InstanceGuid.ToString(), paramSolutionData);
                Log("--", componentParam.InstanceGuid, $"Wrote {paramSolutionData.Keys.Count} branches to param solution data.", 2);
              }

              solutionData.Values.Add(componentInstance.InstanceGuid.ToString(), componentSolutionData);
              Log("--", componentInstance.InstanceGuid, $"Wrote {componentSolutionData.Keys.Count} params to component solution data.", 1);
              break;
            }
          default:
            {
              Log("XX", documentObject.InstanceGuid, $"Unhandled object type [{documentObject.GetType()}]", 1);
              break;
            }
        }
      }

      Log("--", requestData.Document.Id, $"Wrote {solutionData.Values.Keys.Count} components to document solution data.");

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

      NodePenDocumentStream streamData = new NodePenDocumentStream()
      {
        Id = requestData.Document.Id,
        Name = "Test Stream Name",
        Document = requestData.Document,
        SolutionData = solutionData
      };

      string commitId = Helpers.Send(
          stream: $"{Environment.SpeckleEndpoint}/streams/{streamId}/branches/{branchName}",
          data: streamData,
          message: $"Solution ${SID(requestData.SolutionId)}",
          account: account,
          sourceApplication: "nodepen"
      ).Result;

      // Serialize and return response
      Client client = new Client(account);

      Branch streamBranch = client.BranchGet(streamId, branchName, 1).Result;
      string objectId = streamBranch.commits.items[0].referencedObject;

      solutionData["Id"] = requestData.SolutionId;
      solutionData.Manifest.StreamObjectIds.Add(objectId);

      return Response.AsJson(solutionData);
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