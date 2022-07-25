using System.Collections.Generic;
using Newtonsoft.Json;
using Grasshopper.Kernel;

namespace NodePen.Converters
{

    [JsonObject(MemberSerialization.OptOut)]
    public class NodePenDocument
    {

        [JsonProperty("id")]
        public string Id { get; private set; }

        [JsonProperty("nodes")]
        public Dictionary<string, NodePenDocumentNode> Nodes { get; private set; } = new Dictionary<string, NodePenDocumentNode>();

        [JsonProperty("version")]
        public int Version { get; private set; }

        public void AddDocumentNode(IGH_DocumentObject documentObject)
        {
            Nodes.Add("some-guid", new NodePenDocumentNode(documentObject));
        }

    }

    [JsonObject(MemberSerialization.OptOut)]
    public class NodePenDocumentNode
    {

        public string Id { get; set; }

        public NodePenDocumentNode(IGH_DocumentObject documentObject)
        {
            Id = documentObject.InstanceGuid.ToString();
        }

    }

}