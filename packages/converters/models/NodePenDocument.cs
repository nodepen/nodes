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
        public Dictionary<string, NodePenDocumentNode> Nodes { get; private set; } = new Dictionary<string, NodePenDocumentNode>();

        [JsonProperty("version")]
        public int Version { get; private set; }

    }

    [JsonObject(MemberSerialization.OptOut)]
    public class NodePenDocumentNode
    {

        public NodePenDocumentNode()
        {

        }

    }

}