using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace NodePen.Compute
{
  public class NodePenRectangle
  {
    [JsonProperty("width")]
    public double Width { get; set; }

    [JsonProperty("height")]
    public double Height { get; set; }

    [JsonProperty("corners")]
    public Dictionary<string, NodePenPoint> Corners { get; set; } = new Dictionary<string, NodePenPoint>();
  }
}
