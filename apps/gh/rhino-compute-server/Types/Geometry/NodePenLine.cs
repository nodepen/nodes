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
    [JsonProperty("from")]
    public NodePenPoint From { get; set; }

    [JsonProperty("to")]
    public NodePenPoint To { get; set; }
  }
}
