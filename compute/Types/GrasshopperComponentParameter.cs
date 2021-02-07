using Newtonsoft.Json;
using Grasshopper.Kernel;

namespace NodePen.Compute
{
  [JsonObject(MemberSerialization.OptOut)]
  public class GrasshopperComponentParameter
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
