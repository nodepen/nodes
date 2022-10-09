using Nancy;
using Nancy.Routing;
using NodePen.Converters;
using Speckle.Newtonsoft.Json;
using Topshelf;

namespace Rhino.Compute
{

    public class GrasshopperEndpointsModule : NancyModule
    {

        public GrasshopperEndpointsModule(IRouteCacheProvider routeCacheProvider)
        {
            Get["/grasshopper"] = _ => GetGrasshopperConfiguration();
        }

        public Response GetGrasshopperConfiguration()
        {
            return Response.AsJson(NodePenConvert.Templates);
        }

    }

}