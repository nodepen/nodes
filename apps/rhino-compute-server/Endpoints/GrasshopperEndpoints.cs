using Grasshopper.Kernel;
using GH_IO.Serialization;
using Nancy;
using Nancy.Extensions;
using Nancy.Routing;
using NodePen.Converters;
using System;
using System.Linq;
using System.Threading;
using Speckle.Newtonsoft.Json;
using Topshelf;

namespace Rhino.Compute
{
    //      public class FileUploadRequest
    //     {
    //         public HttpFile File { get; set; }
    //     }

    public class GrasshopperEndpointsModule : NancyModule
    {

        public GrasshopperEndpointsModule(IRouteCacheProvider routeCacheProvider)
        {
            Post["/files/gh"] = _ => HandleGrasshopperFileUpload(Context);
            Get["/grasshopper"] = _ => GetGrasshopperConfiguration();
            Post["/grasshopper/id"] = _ => PostGrasshopperDocument(Context);
        }

        public Response HandleGrasshopperFileUpload(NancyContext context)
        {
            var file = context.Request.Files.FirstOrDefault();

            if (file == null)
            {
                return Response.AsText("not ok");
            }

            byte[] fileBinary = new byte[file.Value.Length];
            file.Value.Read(fileBinary, 0, (int)file.Value.Length);

            var archive = new GH_Archive();
            archive.Deserialize_Binary(fileBinary);

            var definition = new GH_Document();
            archive.ExtractObject(definition, "Definition");

            Console.WriteLine(definition.ObjectCount);

            Thread.Sleep(500);

            var document = NodePenConvert.Serialize(definition);

            return Response.AsJson(document);
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