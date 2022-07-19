using Newtonsoft.Json;

namespace NodePen.Converters
{

    [JsonObject(MemberSerialization.OptOut)]
    public struct NodePenPortTemplate
    {

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("nickname")]
        public string NickName { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("type")]
        public string TypeName { get; set; }

        [JsonProperty("isOptional")]
        public bool IsOptional { get; set; }

    }

}