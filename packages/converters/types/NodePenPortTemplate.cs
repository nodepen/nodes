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

    public enum NodePenPortDirection
    {
        [EnumMember(Value = "input")]
        Input,
        [EnumMember(Value = "output")]
        Output
    }

    public class PortDirectionConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var direction = (NodePenPortDirection)value;
            writer.WriteValue(direction == NodePenPortDirection.Input ? "input" : "output");
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var direction = (string)existingValue;
            return direction == "input" ? 0 : 1;
        }

        public override bool CanRead
        {
            get { return true; }
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(NodePenPortDirection);
        }
    }

}