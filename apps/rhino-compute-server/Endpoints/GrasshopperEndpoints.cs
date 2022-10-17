using Nancy;
using Nancy.Extensions;
using Nancy.Routing;
using NodePen.Converters;
using System;
using Speckle.Newtonsoft.Json;
using Topshelf;

namespace Rhino.Compute
{

    public class GrasshopperEndpointsModule : NancyModule
    {

        public GrasshopperEndpointsModule(IRouteCacheProvider routeCacheProvider)
        {
            Get["/grasshopper"] = _ => GetGrasshopperConfiguration();
            Post["/grasshopper/id"] = _ => PostGrasshopperDocument(Context);
        }

        public Response GetGrasshopperConfiguration()
        {
            return Response.AsJson(NodePenConvert.Templates);
        }

        public Response PostGrasshopperDocument(NancyContext context)
        {
            var body = context.Request.Body.AsString();
            var data = JsonConvert.DeserializeObject<dynamic>(body);

            var document = new NodePenDocument(data);

            var commitId = Program.TryThis(document.Result).Result;

            Console.WriteLine(commitId);

            return Response.AsText(commitId);


            // try
            // {
            //
            //     Console.WriteLine(document);
            //     return Response.AsJson(document);
            // }
            // catch (Exception e)
            // {
            //     Console.WriteLine(e.Message);
            //     return Response.AsJson(body);
            // }
        }

    }

}