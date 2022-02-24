using Newtonsoft.Json;

namespace NodePen.Compute
{

  [JsonObject(MemberSerialization.OptOut)]
  public class NodePenDataTreeValue
  {

    [JsonProperty("type")]
    public string Type { get; set; }

    [JsonProperty("value")]
    public string Value { get; set; }

  }

}
