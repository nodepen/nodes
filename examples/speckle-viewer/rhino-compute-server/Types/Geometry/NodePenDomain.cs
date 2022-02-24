using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace NodePen.Compute
{
  public class NodePenDomain
  {
    [JsonProperty("minimum")]
    public double Minimum { get; set; }

    [JsonProperty("maximum")]
    public double Maximum { get; set; }
  }
}
