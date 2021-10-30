using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Grasshopper.Kernel.Types;
using Grasshopper.Kernel.Data;

namespace NodePen.Compute
{

  public class NodePenDataTree : Dictionary<string, Dictionary<string, List<NodePenDataTreeValue>>>
  {

    public GH_Structure<IGH_Goo> GetTree(string parameterId)
    {
      var tree = new GH_Structure<IGH_Goo>();

      this.TryGetValue(parameterId, out var data);

      if (data == null)
      {
        return null;
      }

      foreach (var path in this[parameterId].Keys)
      {
        var pathCrumbs = path.Replace("{", "").Replace("}", "").Split(';').ToList().Where(key => key.Length > 0);
        var pathIndices = pathCrumbs.Select(num => Convert.ToInt32(num)).ToArray();

        var branch = new GH_Path(pathIndices);

        var entries = this[parameterId][path];

        for (var i = 0; i < entries.Count; i++)
        {
          var entry = entries[i];

          var value = entry.Value;

          try
          {
            switch (entry.Type)
            {
              case "number":
                {
                  double numberValue = Convert.ToDouble(value);
                  var numberGoo = new GH_Number(numberValue);

                  tree.Insert(numberGoo, branch, i);

                  continue;
                }
              case "string":
                {
                  string stringValue = value;
                  var stringGoo = new GH_String(stringValue);

                  tree.Insert(stringGoo, branch, i);

                  continue;
                }
              default:
                {
                  Console.WriteLine($"Could not convert NodePen value type '{entry.Type}' to Grasshopper type.");
                  continue;
                }
            }
          } catch (Exception e)
          {
            Console.WriteLine($"Error while trying to convert value {entry.Value} as {entry.Type}!");
            Console.WriteLine(e.Message);
          }

        }

      }

      return tree;
    }

    public NodePenDataTreeValue GetValue(string parameterId, int[] path, int index)
    {
      var pathKey = "{" + string.Join(";", path) + "}";

      return this[parameterId][pathKey][index];
    }

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
