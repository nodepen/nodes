using System.Collections.Generic;
using Newtonsoft.Json;

namespace NodePen.Converters
{

    [JsonObject(MemberSerialization.OptOut)]
    public class NodePenNodeTemplate
    {

        [JsonProperty("guid")]
        public string Guid { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("nickname")]
        public string NickName { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("keywords")]
        public List<string> Keywords { get; set; }

        [JsonProperty("icon")]
        public string Icon { get; set; }

        [JsonProperty("libraryName")]
        public string LibraryName { get; set; }

        [JsonProperty("category")]
        public string Category { get; set; }

        [JsonProperty("subcategory")]
        public string Subcategory { get; set; }

        [JsonProperty("isObsolete")]
        public bool IsObsolete { get; set; }

        [JsonProperty("isVariable")]
        public bool IsVariable { get; set; }

        [JsonProperty("inputs")]
        public List<NodePenPortTemplate> Inputs { get; set; }

        [JsonProperty("outputs")]
        public List<NodePenPortTemplate> Outputs { get; set; }

    }

    [JsonObject(MemberSerialization.OptOut)]
    public class NodePenPortTemplate
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