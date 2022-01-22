using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Nancy;
using Grasshopper.Kernel;
using Newtonsoft.Json;
using System.Reflection;

namespace NodePen.Compute.Routes
{
  public static partial class NodePenRoutes
  {
    public static Response GetGrasshopperAssemblies(NancyContext ctx)
    {
      var objs = new List<GrasshopperComponent>();

      // Convert ReadOnlyCollection of libraries to list for easy searching
      var libraries = new List<GH_AssemblyInfo>();

      var gha = Grasshopper.Instances.ComponentServer.Libraries;
      Console.WriteLine(gha.Count);
      for (int i = 0; i < gha.Count; i++)
      {
        libraries.Add(gha[i]);
      }

      // Convert Object Proxies to Resthopper Components
      var proxies = Grasshopper.Instances.ComponentServer.ObjectProxies;

      for (int i = 0; i < proxies.Count; i++)
      {
        var rc = new GrasshopperComponent();
        rc.Guid = proxies[i].Guid.ToString();
        rc.Name = proxies[i].Desc.Name;
        rc.NickName = proxies[i].Desc.NickName;
        rc.Description = proxies[i].Desc.Description;
        rc.Category = proxies[i].Desc.HasCategory ? proxies[i].Desc.Category : "";
        rc.Subcategory = proxies[i].Desc.HasSubCategory ? proxies[i].Desc.SubCategory : "";
        rc.IsObsolete = proxies[i].Obsolete;
        rc.IsVariable = IsComponentVariable(proxies[i]);

        var ms = new MemoryStream();
        proxies[i].Icon.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
        var bytes = ms.ToArray();
        rc.Icon = Convert.ToBase64String(bytes);

        rc.LibraryName = libraries.Find(x => x.Id == proxies[i].LibraryGuid)?.Name ?? "Not found. :(";

        var obj = proxies[i].CreateInstance() as IGH_Component;

        if (obj != null)
        {
          var p = obj.Params;

          if (obj.Keywords != null && obj.Keywords.Count() > 0)
          {
            rc.Keywords = obj.Keywords.ToList();
          }

          p.Input.ForEach(param => {
            var input = new GrasshopperComponentParameter()
            {
              Name = param.Name,
              NickName = param.NickName,
              Description = param.Description,
              IsOptional = param.Optional,
              TypeName = param.TypeName,
            };
            rc.Inputs.Add(input);
          });

          p.Output.ForEach(param => {
            var output = new GrasshopperComponentParameter()
            {
              Name = param.Name,
              NickName = param.NickName,
              Description = param.Description,
              IsOptional = param.Optional,
              TypeName = param.TypeName,
            };
            rc.Outputs.Add(output);
          });
        }

        objs.Add(rc);
      }
      return JsonConvert.SerializeObject(objs);
    }

    private static bool IsComponentVariable(IGH_ObjectProxy c)
    {
      try
      {
        var a = Assembly.LoadFrom(c.Location);

        var assemblyType = a.GetTypes().FirstOrDefault(x => c.Type.ToString() == x.FullName);

        if (assemblyType == null)
        {
          return false;
        }

        var res = assemblyType.GetTypeInfo().DeclaredMethods.Select(x => x.Name).ToList().Contains("CanInsertParameter");

        return res;
      }
      catch (Exception e)
      {
        return false;
      }
    }
  }
}
