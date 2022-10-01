using System.Collections.Generic;
using Newtonsoft.Json;
using Grasshopper.Kernel;

namespace NodePen.Converters
{

    [JsonObject(MemberSerialization.OptOut)]
    public struct NodePenPortTemplate
    {
        [JsonProperty("__order")]
        private int _order;

        [JsonProperty("__type")]
        private readonly string _type;

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("nickname")]
        public string NickName { get; set; }

        [JsonProperty("keywords")]
        public List<string> Keywords { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("isOptional")]
        public bool IsOptional { get; set; }

        public NodePenPortTemplate(IGH_Param parameter, int order = 0)
        {
            _order = order;
            _type = parameter.TypeName;

            Name = parameter.Name;
            NickName = parameter.NickName;
            Description = parameter.Description;

            Keywords = new List<string>();
            foreach (var keyword in parameter.Keywords)
            {
                Keywords.Add(keyword);
            }

            IsOptional = parameter.Optional;

            // TODO: Flags?
            // parameter.StateTags.ForEach((x) => x.Name)
        }

        public void SetOrder(int order)
        {
            _order = order;
        }

    }

}