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

namespace NodePen.Compute
{
  public class ResthopperEndpointsModule : Nancy.NancyModule
  {

    public ResthopperEndpointsModule(Nancy.Routing.IRouteCacheProvider routeCacheProvider)
    {
      Get["/grasshopper"] = _ => NodePenRoutes.GetGrasshopperAssemblies(Context);
      Post["/grasshopper/graph"] = _ => TryCreateGrasshopperDefinition(Context);
      Post["/grasshopper/solve"] = _ => TrySolveGrasshopperDefinition(Context);
    }

    async static Task<Response> TryCreateGrasshopperDefinition(NancyContext ctx)
    {
      var response = (Response)"Definition creation exceeded 5000ms limit.";
      response.StatusCode = HttpStatusCode.BadRequest;

      try
      {
        await Task.WhenAny(
          Task.Run(() =>
            {
              response = NodePenRoutes.CreateGrasshopperDefinition(ctx);
              response.StatusCode = HttpStatusCode.OK;
            }),
          Task.Delay(5000)
          );
        return response;
      } catch (Exception e)
      {
        response = (Response)e.Message;
        response.StatusCode = HttpStatusCode.InternalServerError;
        return response;
      }
    }

    async static Task<Response> TrySolveGrasshopperDefinition(NancyContext ctx)
    {
      var response = (Response)"Definition execution exceeded 5000ms limit.";
      response.StatusCode = HttpStatusCode.BadRequest;

      try
      {
        await Task.WhenAny(
          Task.Run(() =>
          {
            response = NodePenRoutes.SolveGrasshopperDefinition(ctx);
            response.StatusCode = HttpStatusCode.OK;
          }),
          Task.Delay(5000)
          );
        return response;
      }
      catch (Exception e)
      {
        response = (Response)e.Message;
        response.StatusCode = HttpStatusCode.InternalServerError;
        return response;
      }
    }

  }

}
