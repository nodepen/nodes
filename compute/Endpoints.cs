using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using Nancy;
using GH_IO.Serialization;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Grasshopper.Kernel.Data;
using Grasshopper.Kernel.Parameters;
using Rhino.Geometry;
using System.Reflection;
using System.Linq;
using System.Drawing;
using Nancy.Extensions;
using NodePen.Compute.Routes;
using System.Threading;

namespace NodePen.Compute
{
  public class ResthopperEndpointsModule : Nancy.NancyModule
  {

    public ResthopperEndpointsModule(Nancy.Routing.IRouteCacheProvider routeCacheProvider)
    {
      Get["/grasshopper"] = _ => NodePenRoutes.GetGrasshopperAssemblies(Context);
      Post["/grasshopper/graph"] = _ => TryCreateGrasshopperDefinition(Context);
      Post["/grasshopper/solve", true] = async (_, token) => await TrySolveGrasshopperDefinition(Context, token);
    }

    static Response TryCreateGrasshopperDefinition(NancyContext ctx)
    {
      try
      {
        return NodePenRoutes.CreateGrasshopperDefinition(ctx);
      } catch (Exception e)
      {
        Console.WriteLine(e.Message);
        Console.WriteLine(e.StackTrace);
        var response = (Response)e.Message;
        response.StatusCode = HttpStatusCode.InternalServerError;
        return response;
      }
    }

    static async Task<Response> TrySolveGrasshopperDefinition(NancyContext ctx, CancellationToken token)
    {
      try
      {
        var result = new SolutionResponse()
        {
          Timeout = true,
        };

        var response = (Response)JsonConvert.SerializeObject(result);

        await Task.WhenAny(new Task[]
        {
          Task.Run(() =>
          {
            response = NodePenRoutes.SolveGrasshopperDefinition(ctx);
          }),
          Task.Delay(750),
        });

        return response;
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
        Console.WriteLine(e.StackTrace);
        var response = (Response)e.Message;
        response.StatusCode = HttpStatusCode.InternalServerError;
        return response;
      }
    }

  }

}
