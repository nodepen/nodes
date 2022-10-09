using System.Collections.Generic;
using System.Runtime.Serialization;
using Newtonsoft.Json;

namespace NodePen.Converters
{

    [JsonObject(MemberSerialization.OptOut)]
    public struct NodePenPortTemplate
    {
        [JsonProperty("__order")]
        public int Order { get; private set; }

        [JsonProperty("__direction")]
        public NodePenPortDirection Direction { get; private set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("nickname")]
        public string NickName { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("type")]
        public string TypeName { get; set; }

        [JsonProperty("keywords")]
        public List<string> Keywords { get; set; }

        [JsonProperty("isOptional")]
        public bool IsOptional { get; set; }

        public void SetOrder(int order)
        {
            Order = order;
        }

        public void SetDirection(NodePenPortDirection direction)
        {
            Direction = direction;
        }

    }

    public enum NodePenPortDirection
    {
        [EnumMember(Value = "input")]
        Input,
        [EnumMember(Value = "output")]
        Output
    }

}