using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NodePen.Compute
{

  public class NodePenDataTree : Dictionary<string, Dictionary<string, List<NodePenDataTreeValue>>>
  {
    public override string ToString()
    {
      var sb = new StringBuilder();

      foreach (var parameter in this.Keys)
      {
        sb.AppendLine($"####\t{parameter}");

        foreach (var path in this[parameter].Keys)
        {
          sb.AppendLine();
          sb.AppendLine($"{path}");

          var values = this[parameter][path];

          for (var i = 0; i < values.Count; i++)
          {
            var entry = values[i];

            sb.AppendLine($"{i}\t{entry.Value}");
          }

        }

      }

      return sb.ToString();
    }
  }

}
