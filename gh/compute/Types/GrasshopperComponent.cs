using System.Collections.Generic;
using Newtonsoft.Json;
using Grasshopper.Kernel;

namespace NodePen.Compute
{
  [JsonObject(MemberSerialization.OptOut)]
  public class GrasshopperComponent
  {
    [JsonProperty("guid")]
    public string Guid { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("nickname")]
    public string NickName { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

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
    public List<GrasshopperComponentParameter> Inputs { get; set; }

    [JsonProperty("outputs")]
    public List<GrasshopperComponentParameter> Outputs { get; set; }

    public GrasshopperComponent()
    {
      Inputs = new List<GrasshopperComponentParameter>();
      Outputs = new List<GrasshopperComponentParameter>();
    }
  }
}
