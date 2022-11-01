using System;
using System.Collections.Generic;
using Speckle.Core.Models;
using Speckle.Newtonsoft.Json;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;
using Grasshopper.Kernel.Data;
using Grasshopper.Kernel.Parameters;
using Objects.Geometry;

namespace NodePen.Converters
{

    public class NodePenDocument
    {

        [JsonProperty("id")]
        public string Id { get; private set; } = Guid.NewGuid().ToString();

        [JsonProperty("nodes")]
        public Dictionary<string, NodePenDocumentNode> Nodes { get; set; } = new Dictionary<string, NodePenDocumentNode>();

        [JsonProperty("configuration")]
        public NodePenDocumentConfiguration Configuration { get; set; } = new NodePenDocumentConfiguration();

        [JsonProperty("version")]
        public int Version { get; private set; } = 1;

        public DebugClass Result { get; private set; }

        public NodePenDocument() { }

        public NodePenDocument(dynamic data)
        {
            var testDocument = data["nodes"];
            var testNode = testDocument["test-element-id-a"];

            var templateId = Convert.ToString(testNode["templateId"]) as string;

            double radiusValue = Convert.ToDouble(testNode["values"]["input-b"]["{0}"][0]["value"]);
            var radiusValueGoo = new GH_Number(radiusValue);
            Console.WriteLine(radiusValue);
            int segmentsValue = Convert.ToInt32(testNode["values"]["input-c"]["{0}"][0]["value"]);
            var segmentsValueGoo = new GH_Integer(segmentsValue);
            Console.WriteLine(segmentsValue);

            var ghdoc = new GH_Document();
            var proxies = Grasshopper.Instances.ComponentServer.ObjectProxies as List<IGH_ObjectProxy>;

            var nodeProxy = proxies.Find((proxy) => proxy.Guid.ToString() == templateId);
            var nodeInstance = nodeProxy.CreateInstance() as IGH_Component;

            ghdoc.AddObject(nodeInstance, false);

            var tree = new GH_Structure<GH_Number>();
            var pathIndices = new List<int>() { 0 }.ToArray();
            var branch = new GH_Path(pathIndices);
            tree.Insert(radiusValueGoo, branch, 0);
            var param = nodeInstance.Params.Input[1] as Param_Number;
            param.SetPersistentData(tree, branch, radiusValueGoo);

            var param2 = nodeInstance.Params.Input[2] as Param_Integer;
            param2.SetPersistentData(tree, branch, segmentsValueGoo);



            // nodeInstance.Params.Input[1].ClearData();
            // nodeInstance.Params.Input[1].ExpireSolution(false);
            // var res = nodeInstance.Params.Input[1].AddVolatileData(new Grasshopper.Kernel.Data.GH_Path(new[] { 0 }), 0, radiusValueGoo);
            // Console.WriteLine(res);

            // nodeInstance.Params.Input[2].ClearData();
            // nodeInstance.Params.Input[2].ExpireSolution(false);
            // Console.WriteLine(nodeInstance.Params.Input[2].Name);
            // Console.WriteLine(nodeInstance.Params.Input[2].VolatileDataCount);
            // var res2 = nodeInstance.Params.Input[2].AddVolatileData(new Grasshopper.Kernel.Data.GH_Path(new[] { 0 }), 0, segmentsValueGoo);
            // Console.WriteLine(nodeInstance.Params.Input[2].VolatileDataCount);
            // Console.WriteLine(res2);

            ghdoc.Enabled = true;
            ghdoc.NewSolution(true, GH_SolutionMode.CommandLine);

            var result = new DebugClass();

            foreach (var instance in ghdoc.Objects)
            {
                switch (instance)
                {
                    case IGH_Component component:
                        {
                            Console.WriteLine(component.RuntimeMessageLevel);
                            var parameter = component.Params.Output[0];

                            Console.WriteLine(parameter.Name);
                            Console.WriteLine(parameter.VolatileData.PathCount);

                            for (var i = 0; i < parameter.VolatileData.PathCount; i++)
                            {
                                var currentPath = parameter.VolatileData.get_Path(i);
                                var currentBranch = parameter.VolatileData.get_Branch(currentPath);

                                for (var j = 0; j < currentBranch.Count; j++)
                                {
                                    var goo = currentBranch[j] as IGH_Goo;

                                    if (goo == null)
                                    {
                                        // `goo` appears to be null, not absent, on invalid solutions
                                        Console.WriteLine("null");
                                        continue;
                                    }

                                    var curveGoo = goo as GH_Curve;
                                    var geo = curveGoo.Value;

                                    Console.WriteLine(geo.Degree);

                                    var coordinates = new List<double>();

                                    var spans = geo.SpanCount;

                                    Console.WriteLine($"Span count: {spans}");

                                    for (var k = 0; k < spans; k++)
                                    {
                                        var domain = geo.SpanDomain(k);
                                        var pt = geo.PointAt(domain.Min);
                                        coordinates.Add(pt.X);
                                        coordinates.Add(pt.Y);
                                        coordinates.Add(pt.Z);
                                    }

                                    var end = curveGoo.Value.PointAtEnd;

                                    coordinates.Add(end.X);
                                    coordinates.Add(end.Y);
                                    coordinates.Add(end.Z);

                                    result.displayValue = new List<Polyline>() { new Polyline(coordinates) };
                                    // result["displayValue"] = new Polyline(coordinates);
                                }
                            }
                            break;
                        }
                    default:
                        {
                            Console.WriteLine($"Skipped {instance.GetType()}");
                            break;
                        }
                }
            }

            Result = result;
        }

        // public void AddDocumentNode(IGH_DocumentObject documentObject)
        // {
        //     Nodes.Add("some-guid", new NodePenDocumentNode(documentObject));
        // }

    }

    public class DebugClass : Base
    {

        [DetachProperty]
        public List<Polyline> displayValue { get; set; }

        public string name { get; set; } = "TEST";

        public DebugClass() { }
    }

    public class NodePenDocumentConfiguration
    {

        [JsonProperty("pinnedPorts")]
        public List<PinnedPortConfiguration> PinnedPorts { get; set; } = new List<PinnedPortConfiguration>();

        public class PinnedPortConfiguration
        {

            [JsonProperty("nodeInstanceId")]
            public string NodeInstanceId { get; set; }

            [JsonProperty("portInstanceId")]
            public string PortInstanceId { get; set; }

        }

    }

    public class NodePenDocumentNode
    {

        [JsonProperty("instanceId")]
        public string InstanceId { get; set; }

        [JsonProperty("templateId")]
        public string TemplateId { get; set; }

        [JsonProperty("position")]
        public NodePenDocumentNodePosition Position { get; set; } = new NodePenDocumentNodePosition();

        [JsonProperty("dimensions")]
        public NodePenDocumentNodeDimensions Dimensions { get; set; } = new NodePenDocumentNodeDimensions();

        [JsonProperty("sources")]
        public Dictionary<string, List<NodePenPortReference>> Sources { get; set; } = new Dictionary<string, List<NodePenPortReference>>();

        [JsonProperty("inputs")]
        public Dictionary<string, int> Inputs { get; set; } = new Dictionary<string, int>();

        [JsonProperty("outputs")]
        public Dictionary<string, int> Outputs { get; set; } = new Dictionary<string, int>();

        [JsonProperty("values")]
        public Dictionary<string, NodePenDataTree> Values { get; set; } = new Dictionary<string, NodePenDataTree>();

        public NodePenDocumentNode()
        {

        }

    }

    public class NodePenDocumentNodePosition
    {
        [JsonProperty("x")]
        public double X { get; set; } = 0;

        [JsonProperty("y")]
        public double Y { get; set; } = 0;
    }

    public class NodePenDocumentNodeDimensions
    {
        [JsonProperty("width")]
        public double Width { get; set; } = 0;

        [JsonProperty("height")]
        public double Height { get; set; } = 0;
    }

    public class NodePenPortReference
    {
        [JsonProperty("nodeInstanceId")]
        public string NodeInstanceId { get; set; }

        [JsonProperty("portInstanceId")]
        public string PortInstanceId { get; set; }
    }

    public class NodePenDataTree : Dictionary<string, List<NodePenDataTreeValue>>
    {

    }

    public class NodePenDataTreeValue
    {

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("value")]
        public double Value { get; set; }

    }

}