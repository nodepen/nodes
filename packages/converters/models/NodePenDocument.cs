using System.Collections.Generic;
using Newtonsoft.Json;

namespace NodePen.Converters
{

    [JsonObject(MemberSerialization.OptOut)]
    public class NodePenDocument
    {

        [JsonProperty("id")]
        public string Id { get; private set; }

        [JsonProperty("nodes")]
        private Dictionary<string, NodePenDocumentNode> Nodes { get; set; } = new Dictionary<string, NodePenDocumentNode>();

    }

    [JsonObject(MemberSerialization.OptOut)]
    public class NodePenDocumentNode
    {

        public NodePenDocumentNode()
        {

        }

    }

}