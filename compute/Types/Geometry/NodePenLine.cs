using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace NodePen.Compute
{
  public class NodePenLine
  {
    [JsonProperty("start")]
    public NodePenPoint Start { get; set; }

    [JsonProperty("end")]
    public NodePenPoint End { get; set; }
  }
}
