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
using Speckle.Core.Api;
using Speckle.Core.Credentials;
using Speckle.Core.Models;
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

        public class NodePenSolutionRequestBody
        {
            [JsonProperty("solutionId")]
            public string SolutionId { get; set; }

            [JsonProperty("document")]
            public NodePenDocument Document { get; set; }
        }

        public class NodePenSolutionManifest
        {
            [JsonProperty("id")]
            public string Id { get; set; }

            [JsonProperty("streamObjectIds")]
            public List<string> StreamObjectIds { get; set; } = new List<string>();
        }

        public class NodePenSolution : Base
        {

            [DetachProperty]
            public List<Polyline> displayValue { get; set; }

            public string name { get; set; } = "TEST";
        }

        public Response SolveGrasshopperDocument(NancyContext context)
        {
            var body = context.Request.Body.AsString();
            var data = NJsonConvert.DeserializeObject<NodePenSolutionRequestBody>(body);

            var archive = NodePenConvert.Deserialize<GH_Archive>(data.Document);

            var definition = new GH_Document();
            archive.ExtractObject(definition, "definition");

            Console.WriteLine(definition.ObjectCount);

            definition.Enabled = true;
            definition.NewSolution(true, GH_SolutionMode.Silent);

            var response = new NodePenSolutionManifest()
            {
                Id = "",
                StreamObjectIds = new List<string>(),
            };

            return Response.AsJson(response);

            // var archive = new GH_Archive();
            // archive.Deserialize_Xml(NodePenConvert.DEBUG_PreviousDocument);

            // var definition = new GH_Document();
            // if (!archive.ExtractObject(definition, "Definition"))
            // {
            //     Console.WriteLine("???");
            // }

            // definition.Enabled = true;

            // foreach (var key in data.UserValues.Keys)
            // {
            //     var value = data.UserValues[key];

            //     Console.WriteLine(key);
            //     Console.WriteLine(value);

            //     var referenceInfo = key.Split(':');

            //     var nodeId = referenceInfo[0];
            //     var portId = referenceInfo[1];

            //     var docObject = definition.Objects.FirstOrDefault((obj) => obj.InstanceGuid.ToString() == nodeId);

            //     if (docObject == null || !(docObject is IGH_Component))
            //     {
            //         Console.WriteLine($"Could not find document object {nodeId}");
            //         continue;
            //     }

            //     var component = docObject as IGH_Component;

            //     for (var i = 0; i < component.Params.Input.Count; i++)
            //     {
            //         var inputParam = component.Params.Input[i];

            //         if (inputParam.InstanceGuid.ToString() != portId)
            //         {
            //             continue;
            //         }

            //         switch (inputParam)
            //         {
            //             case Param_Number numberParam:
            //                 {
            //                     var valueGoo = new GH_Number(value);

            //                     var tree = new GH_Structure<GH_Number>();
            //                     var pathIndices = new List<int>() { 0 }.ToArray();
            //                     var branch = new GH_Path(pathIndices);
            //                     tree.Insert(valueGoo, branch, 0);

            //                     numberParam.SetPersistentData(tree, branch, valueGoo);
            //                     break;
            //                 }
            //             case Param_Integer integerParam:
            //                 {
            //                     var valueGoo = new GH_Integer(Convert.ToInt32(value));

            //                     var tree = new GH_Structure<GH_Integer>();
            //                     var pathIndices = new List<int>() { 0 }.ToArray();
            //                     var branch = new GH_Path(pathIndices);
            //                     tree.Insert(valueGoo, branch, 0);

            //                     integerParam.SetPersistentData(tree, branch, value);
            //                     break;
            //                 }
            //         }
            //     }
            // }

            // definition.Enabled = true;
            // definition.NewSolution(true, GH_SolutionMode.CommandLine);

            // var solution = new NodePenSolution();
            // solution.id = data.SolutionId;
            // solution.displayValue = new List<Polyline>();

            // for (var x = 0; x < definition.ObjectCount; x++)
            // {
            //     var docObject = definition.Objects[x];

            //     if (!(docObject is IGH_Component))
            //     {
            //         continue;
            //     }

            //     Console.WriteLine(docObject.InstanceGuid);

            //     var component = docObject as IGH_Component;

            //     for (var i = 0; i < component.Params.Output.Count; i++)
            //     {
            //         var outputParam = component.Params.Output[i];

            //         for (var j = 0; j < outputParam.VolatileData.PathCount; j++)
            //         {
            //             var currentPath = outputParam.VolatileData.get_Path(j);
            //             var currentBranch = outputParam.VolatileData.get_Branch(currentPath);

            //             for (var k = 0; k < currentBranch.Count; k++)
            //             {
            //                 try
            //                 {
            //                     var goo = currentBranch[k] as IGH_Goo;

            //                     if (goo == null)
            //                     {
            //                         // `goo` appears to be null, not absent, on invalid solutions
            //                         continue;
            //                     }

            //                     switch (goo.TypeName)
            //                     {
            //                         case "Circle":
            //                             {
            //                                 var circleGoo = goo as GH_Circle;

            //                                 var circle = circleGoo.Value;
            //                                 // solution.displayValue.Add(new Circle(new Plane(new Point(circle.Center.X, circle.Center.Y, circle.Center.Z), new Vector(circle.Plane.Normal.X, circle.Plane.Normal.Y, circle.Plane.Normal.Z), new Vector(circle.Plane.XAxis.X, circle.Plane.XAxis.Y, circle.Plane.XAxis.Z), new Vector(circle.Plane.YAxis.X, circle.Plane.YAxis.Y, circle.Plane.YAxis.Z)), circle.Radius));
            //                                 Console.WriteLine(circle);
            //                                 break;
            //                             }
            //                         case "Curve":
            //                             {
            //                                 var curveGoo = goo as GH_Curve;
            //                                 var curve = curveGoo.Value;

            //                                 var coords = new List<double>();

            //                                 coords.Add(curve.PointAtStart.X);
            //                                 coords.Add(curve.PointAtStart.Y);
            //                                 coords.Add(curve.PointAtStart.Z);

            //                                 for (var z = 0; z < curve.SpanCount; z++)
            //                                 {
            //                                     var span = curve.SpanDomain(z);

            //                                     var pt = curve.PointAt(span.Max);

            //                                     coords.Add(pt.X);
            //                                     coords.Add(pt.Y);
            //                                     coords.Add(pt.Z);
            //                                 }

            //                                 var rep = new Polyline(coords);

            //                                 solution.displayValue.Add(rep);

            //                                 break;
            //                             }
            //                         default:
            //                             {
            //                                 // Console.WriteLine($"Did not parse [{goo.TypeName}]");
            //                                 break;
            //                             }
            //                     }
            //                 }
            //                 catch (Exception e)
            //                 {
            //                     Console.WriteLine(e.Message);
            //                 }

            //             }
            //         }
            //     }
            // }

            // var streamId = "e1aa8e3dce";
            // var branchName = "main";

            // var account = new Account()
            // {
            //     token = "ed0010b22f0211453ad5807fca57925722cc86224a",
            //     serverInfo = new ServerInfo()
            //     {
            //         url = "http://localhost:3000",
            //         company = "NodePen"
            //     },
            //     userInfo = new UserInfo()
            //     {
            //         email = "chuck@nodepen.io"
            //     }
            // };

            // var commitId = Helpers.Send(
            //     stream: $"http://localhost:3000/streams/{streamId}/branches/{branchName}",
            //     data: solution,
            //     message: "Test commit",
            //     account: account,
            //     sourceApplication: "nodepen"
            // ).Result;

            // var client = new Client(account);

            // var streamBranch = client.BranchGet(streamId, branchName, 1).Result;
            // var objectId = streamBranch.commits.items[0].referencedObject;

            // response.StreamObjectIds.Add(objectId);

            // return Response.AsJson(response);
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