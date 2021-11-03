using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Rhino.Geometry;

namespace NodePen.Compute
{
  public class NodePenPoint
  {
    [JsonProperty("x")]
    public double X { get; set; }

    [JsonProperty("y")]
    public double Y { get; set; }

    [JsonProperty("z")]
    public double Z { get; set; }

    public NodePenPoint() { }

    public NodePenPoint(double x, double y, double z)
    {
      X = x;
      Y = y;
      Z = z;
    }

    public NodePenPoint(Point3d pt)
    {
      X = pt.X;
      Y = pt.Y;
      Z = pt.Z;
    }
  }
}
