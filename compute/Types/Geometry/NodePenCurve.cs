using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace NodePen.Compute
{
  class NodePenCurve
  {
    public int Degree { get; set; }
    public List<List<double>> Segments { get; set; } = new List<List<double>>();
  }
}
