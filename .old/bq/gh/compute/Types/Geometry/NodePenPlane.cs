using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace NodePen.Compute
{
  public class NodePenPlane
  {
    [JsonProperty("origin")]
    public NodePenPoint Origin { get; set; }

    [JsonProperty("normal")]
    public NodePenPoint Normal { get; set; }
  }
}
