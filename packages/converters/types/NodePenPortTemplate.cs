using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using Speckle.Newtonsoft.Json;

namespace NodePen.Converters
{

    [JsonObject(MemberSerialization.OptOut)]
    public struct NodePenPortTemplate
    {

        public int __order { get; private set; }

        public string __direction { get; private set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("nickName")]
        public string NickName { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("typeName")]
        public string TypeName { get; set; }

        [JsonProperty("keywords")]
        public List<string> Keywords { get; set; }

        [JsonProperty("isOptional")]
        public bool IsOptional { get; set; }

        public void SetOrder(int order)
        {
            __order = order;
        }

        public void SetDirection(string direction)
        {
            __direction = direction;
        }

    }

}