using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace NodePen.Compute
{
  public class NodePenCurve
  {
    [JsonProperty("degree")]
    public int Degree { get; set; }

    [JsonProperty("segments")]
    public List<List<double>> Segments { get; set; } = new List<List<double>>();
  }
}
