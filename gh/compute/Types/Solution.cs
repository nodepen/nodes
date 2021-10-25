using System.Collections.Generic;
using Newtonsoft.Json;

namespace NodePen.Compute
{
  public class SolutionResponse
  {
    [JsonProperty("data")]
    public List<SolutionData> Data { get; set; }

    [JsonProperty("messages")]
    public List<SolutionMessage> Messages { get; set; }

    [JsonProperty("duration")]
    public long Duration { get; set; }

    [JsonProperty("timeout")]
    public bool Timeout { get; set; } = false;
  }

  public class SolutionData
  {
    [JsonProperty("elementId")]
    public string ElementId { get; set; }

    [JsonProperty("parameterId")]
    public string ParameterId { get; set; }

    [JsonProperty("values")]
    public List<SolutionDataBranch> Values { get; set; } = new List<SolutionDataBranch>();
  }

  public class SolutionDataBranch
  {
    [JsonProperty("path")]
    public List<int> Path { get; set; } = new List<int>();

    [JsonProperty("data")]
    public List<SolutionDataValue> Data { get; set; } = new List<SolutionDataValue>();
  }

  public class SolutionDataValue
  {
    [JsonProperty("value")]
    public string Value { get; set; }

    [JsonProperty("type")]
    public string Type { get; set; }
  }

  public class SolutionMessage
  {
    [JsonProperty("elementId")]
    public string ElementId { get; set; }

    [JsonProperty("message")]
    public string Message { get; set; }

    [JsonProperty("level")]
    public string Level { get; set; }
  }
}
