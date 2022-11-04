using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;
using Grasshopper.Kernel.Data;
using Grasshopper.Kernel.Parameters;
using GH_IO.Serialization;
using Nancy;
using Nancy.Extensions;
using Nancy.Routing;
using NodePen.Converters;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using Speckle.Core.Api;
using Speckle.Core.Credentials;
using Speckle.Core.Models;
using System.Text;
using Objects.Geometry;
using Speckle.Newtonsoft.Json;
using Topshelf;
using NJsonConvert = Newtonsoft.Json.JsonConvert;

namespace Rhino.Compute
{
    //      public class FileUploadRequest
    //     {
    //         public HttpFile File { get; set; }
    //     }

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

        private string SID(Guid guid)
        {
            return SID(guid.ToString());
        }

        private void Log(string prefix, string id, string message, int tabCount = 0)
        {
            return;
            try
            {
                var messageBuilder = new StringBuilder();

                for (var i = 0; i < tabCount; i++)
                {
                    messageBuilder.Append("    ");
                }

                messageBuilder.Append(prefix);
                messageBuilder.Append($" {SID(id)}");
                messageBuilder.Append($" {message}");

                Console.WriteLine(messageBuilder.ToString());
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
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
            var body = context.Request.Body.AsString();
            var requestData = NJsonConvert.DeserializeObject<NodePenSolutionRequestBody>(body);

            var timer = new Stopwatch();

            timer.Start();

            // Create Grasshopper document
            var archive = NodePenConvert.Deserialize<GH_Archive>(requestData.Document);

            var definition = new GH_Document();
            archive.ExtractObject(definition, "definition");

            Console.WriteLine(definition.ObjectCount);

            // Solve Grasshopper document
            definition.Enabled = true;
            definition.NewSolution(true, GH_SolutionMode.Silent);

            timer.Stop();

            // Extract solution data
            Log(">>", requestData.Document.Id, "Document");
            Log(" >", requestData.Document.Id, $"Created and solved document in {timer.ElapsedMilliseconds}ms");

            var solutionData = new NodePenSolutionData()
            {
                Id = requestData.SolutionId
            };

            foreach (var documentObject in definition.Objects)
            {
                Log(">>", documentObject.InstanceGuid, "Document Object", 1);

                switch (documentObject)
                {
                    case IGH_Component componentInstance:
                        {
                            Log(" >", componentInstance.InstanceGuid, "IGH_Component", 1);
                            Log(" >", componentInstance.InstanceGuid, componentInstance.Name, 1);
                            var componentSolutionData = new Dictionary<string, NodePenDataTree>();

                            Log(" >", componentInstance.InstanceGuid, $"{componentInstance.Params.Input.Count} input params", 1);
                            Log(" >", componentInstance.InstanceGuid, $"{componentInstance.Params.Output.Count} output params", 1);

                            var componentParams = new List<IGH_Param>();
                            componentParams.AddRange(componentInstance.Params.Input);
                            componentParams.AddRange(componentInstance.Params.Output);

                            foreach (var componentParam in componentParams)
                            {
                                Log(">>", componentParam.InstanceGuid, "IGH_Param", 2);
                                Log(" >", componentParam.InstanceGuid, $"Found {componentParam.VolatileData.PathCount} branch(es) of results.", 2);
                                var paramSolutionData = new NodePenDataTree();

                                for (var i = 0; i < componentParam.VolatileData.PathCount; i++)
                                {
                                    var currentPath = componentParam.VolatileData.get_Path(i);
                                    var currentBranch = componentParam.VolatileData.get_Branch(currentPath);

                                    var branchKey = $"{{{String.Join(";", currentPath.Indices.Select((idx) => idx.ToString()))}}}";

                                    Log(">>", branchKey, $"Branch with {currentBranch.Count} entries", 3);

                                    var branchSolutionData = new List<NodePenDataTreeValue>();

                                    foreach (var entry in currentBranch)
                                    {
                                        var goo = entry as IGH_Goo;

                                        if (goo == null)
                                        {
                                            // `goo` appears to be null, not absent, on invalid solutions
                                            continue;
                                        }

                                        switch (goo.TypeName)
                                        {
                                            case "Curve":
                                                {
                                                    Log(" >", branchKey, "Curve", 3);

                                                    var curveGoo = goo as GH_Curve;
                                                    var curve = curveGoo.Value;

                                                    var coords = new List<double>();

                                                    coords.Add(curve.PointAtStart.X);
                                                    coords.Add(curve.PointAtStart.Y);
                                                    coords.Add(curve.PointAtStart.Z);

                                                    for (var z = 0; z < curve.SpanCount; z++)
                                                    {
                                                        var span = curve.SpanDomain(z);

                                                        var pt = curve.PointAt(span.Max);

                                                        coords.Add(pt.X);
                                                        coords.Add(pt.Y);
                                                        coords.Add(pt.Z);
                                                    }

                                                    var displayValue = new Polyline(coords);

                                                    var entrySolutionData = new NodePenDataTreeValue()
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

                                                    var integerGoo = goo as GH_Integer;
                                                    var integer = integerGoo.Value;

                                                    var entrySolutionData = new NodePenDataTreeValue()
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

                                                    var numberGoo = goo as GH_Number;
                                                    var number = numberGoo.Value;

                                                    var entrySolutionData = new NodePenDataTreeValue()
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

                                                    var entrySolutionData = new NodePenDataTreeValue()
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
            var streamId = "e1aa8e3dce";
            var branchName = "main";

            var account = new Account()
            {
                token = "ed0010b22f0211453ad5807fca57925722cc86224a",
                serverInfo = new ServerInfo()
                {
                    url = "http://localhost:3000",
                    company = "NodePen"
                },
                userInfo = new UserInfo()
                {
                    email = "chuck@nodepen.io"
                }
            };

            var streamData = new NodePenDocumentStream()
            {
                Id = requestData.Document.Id,
                Name = "Test Stream Name",
                Document = requestData.Document,
                SolutionData = solutionData
            };

            var commitId = Helpers.Send(
                stream: $"http://localhost:3000/streams/{streamId}/branches/{branchName}",
                data: streamData,
                message: $"Solution ${SID(requestData.SolutionId)}",
                account: account,
                sourceApplication: "nodepen"
            ).Result;

            // Serialize and return response
            var client = new Client(account);

            var streamBranch = client.BranchGet(streamId, branchName, 1).Result;
            var objectId = streamBranch.commits.items[0].referencedObject;

            solutionData.Manifest.StreamObjectIds.Add(objectId);

            return Response.AsJson(solutionData);
        }

        public Response HandleGrasshopperFileUpload(NancyContext context)
        {
            var file = context.Request.Files.FirstOrDefault();

            if (file == null)
            {
                return Response.AsText("not ok");
            }

            byte[] fileBinary = new byte[file.Value.Length];
            file.Value.Read(fileBinary, 0, (int)file.Value.Length);

            var archive = new GH_Archive();
            archive.Deserialize_Binary(fileBinary);

            var definition = new GH_Document();
            archive.ExtractObject(definition, "Definition");

            NodePenConvert.DEBUG_PreviousDocument = archive.Serialize_Xml();

            var document = NodePenConvert.Serialize(definition);

            return Response.AsJson(document);
        }

        public Response GetGrasshopperConfiguration()
        {
            return Response.AsJson(NodePenConvert.Templates);
        }

    }

}