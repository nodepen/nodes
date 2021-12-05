using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace NodePen.Compute
{
  public class NodePenCircle
  {
    [JsonProperty("normal")]
    public NodePenPoint Normal { get; set; }

    [JsonProperty("center")]
    public NodePenPoint Center { get; set; }

    [JsonProperty("radius")]
    public double Radius { get; set; }
  }
}
