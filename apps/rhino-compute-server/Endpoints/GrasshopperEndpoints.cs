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
using System.Linq;
using System.Threading;
using Speckle.Newtonsoft.Json;
using Topshelf;

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
            Post["/grasshopper/id"] = _ => PostGrasshopperDocument(Context);
            Post["/grasshopper/id/solution"] = _ => SolveGrasshopperDocument(Context);
        }

        public class NodePenSolutionRequestBody
        {
            [JsonProperty("solutionId")]
            public string SolutionId { get; set; }

            [JsonProperty("userValues")]
            public Dictionary<string, double> UserValues { get; set; } = new Dictionary<string, double>();
        }

        public class NodePenSolutionManifest
        {
            [JsonProperty("id")]
            public string Id { get; set; }

            [JsonProperty("streamObjectIds")]
            public List<string> StreamObjectIds { get; set; } = new List<string>();
        }

        public Response SolveGrasshopperDocument(NancyContext context)
        {
            var body = context.Request.Body.AsString();
            var data = JsonConvert.DeserializeObject<NodePenSolutionRequestBody>(body);

            var response = new NodePenSolutionManifest()
            {
                Id = data.SolutionId,
                StreamObjectIds = new List<string>(),
            };

            var archive = new GH_Archive();
            archive.Deserialize_Xml(NodePenConvert.DEBUG_PreviousDocument);

            var definition = new GH_Document();
            if (!archive.ExtractObject(definition, "Definition"))
            {
                Console.WriteLine("???");
            }

            definition.Enabled = true;

            foreach (var key in data.UserValues.Keys)
            {
                var value = data.UserValues[key];

                Console.WriteLine(key);
                Console.WriteLine(value);

                var referenceInfo = key.Split(':');

                var nodeId = referenceInfo[0];
                var portId = referenceInfo[1];

                var docObject = definition.Objects.FirstOrDefault((obj) => obj.InstanceGuid.ToString() == nodeId);

                if (docObject == null || !(docObject is IGH_Component))
                {
                    Console.WriteLine($"Could not find document object {nodeId}");
                    continue;
                }

                var component = docObject as IGH_Component;

                for (var i = 0; i < component.Params.Input.Count; i++)
                {
                    var inputParam = component.Params.Input[i];

                    if (inputParam.InstanceGuid.ToString() != portId)
                    {
                        continue;
                    }

                    switch (inputParam)
                    {
                        case Param_Number numberParam:
                            {
                                var valueGoo = new GH_Number(value);

                                var tree = new GH_Structure<GH_Number>();
                                var pathIndices = new List<int>() { 0 }.ToArray();
                                var branch = new GH_Path(pathIndices);
                                tree.Insert(valueGoo, branch, 0);

                                numberParam.SetPersistentData(tree, branch, valueGoo);
                                break;
                            }
                        case Param_Integer integerParam:
                            {
                                var valueGoo = new GH_Integer(Convert.ToInt32(value));

                                var tree = new GH_Structure<GH_Integer>();
                                var pathIndices = new List<int>() { 0 }.ToArray();
                                var branch = new GH_Path(pathIndices);
                                tree.Insert(valueGoo, branch, 0);

                                integerParam.SetPersistentData(tree, branch, value);
                                break;
                            }
                    }
                }
            }

            definition.Enabled = true;
            definition.NewSolution(true, GH_SolutionMode.CommandLine);

            return Response.AsJson(response);
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

        public Response PostGrasshopperDocument(NancyContext context)
        {
            var body = context.Request.Body.AsString();
            var data = JsonConvert.DeserializeObject<dynamic>(body);

            var document = new NodePenDocument(data);

            var commitId = Program.TryThis(document.Result).Result;

            Console.WriteLine(commitId);

            return Response.AsText(commitId);


            // try
            // {
            //
            //     Console.WriteLine(document);
            //     return Response.AsJson(document);
            // }
            // catch (Exception e)
            // {
            //     Console.WriteLine(e.Message);
            //     return Response.AsJson(body);
            // }
        }

    }

}