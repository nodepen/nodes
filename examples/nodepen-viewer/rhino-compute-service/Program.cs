using System;
using Topshelf;
using Microsoft.Owin.Hosting;
using Owin;
using Nancy;
using Nancy.TinyIoc;
using Nancy.Bootstrapper;
using NodePen.Converters;

namespace Rhino.Compute
{

    class Program
    {

        public static IDisposable RhinoCore { get; set; }

        static void Main(string[] args)
        {
            RhinoInside.Resolver.Initialize();

            HostFactory.Run((Host) =>
            {
                Host.Service<SelfHostService>();
                Host.SetDisplayName("NodePen");
            });

        }

    }

    internal class SelfHostService : ServiceControl
    {

        public bool Start(HostControl host)
        {
            // Start headless Rhino process
            Console.WriteLine($"Rhino system directory: {RhinoInside.Resolver.RhinoSystemDirectory}");
            Program.RhinoCore = new Rhino.Runtime.InProcess.RhinoCore(null, Rhino.Runtime.InProcess.WindowStyle.NoWindow);

            // Start web server
            var options = new StartOptions();
            options.Urls.Add("http://localhost:6500");

            WebApp.Start<Startup>(options);

            return true;
        }

        public bool Stop(HostControl host)
        {
            return true;
        }

    }

    internal class Startup
    {

        public void Configuration(IAppBuilder app)
        {
            app.UseNancy();
        }

    }

    public class Bootstrapper : Nancy.DefaultNancyBootstrapper
    {
        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
        {
            // Load Grasshopper
            var pluginObject = Rhino.RhinoApp.GetPlugInObject("Grasshopper");
            var runheadless = pluginObject?.GetType().GetMethod("RunHeadless");
            if (runheadless != null)
            {
                runheadless.Invoke(pluginObject, null);
            }

            Class1.Test();

            base.ApplicationStartup(container, pipelines);
        }

    }

    public class ConverterEndpointsModule : NancyModule
    {

        public ConverterEndpointsModule(Nancy.Routing.IRouteCacheProvider routeCacheProvider)
        {
            Post["/convert"] = _ => ConvertGrasshopperDocumentToNodePenDocument(Context);
        }

        public Response ConvertGrasshopperDocumentToNodePenDocument(Nancy.NancyContext ctx)
        {
            var (from, to) = ParseConversionRequest(ctx);

            Console.WriteLine(from);
            Console.WriteLine(to);

            return (Response)"OK";
        }

        private (ConversionTarget, ConversionTarget) ParseConversionRequest(NancyContext ctx)
        {
            string from = ctx.Request.Query.from;
            string to = ctx.Request.Query.to;

            return (GetConversionTarget(from), GetConversionTarget(to));
        }

        private ConversionTarget GetConversionTarget(string code)
        {
            switch (code)
            {
                case "gh":
                    {
                        return ConversionTarget.Grasshopper;
                    }
                case "np":
                    {
                        return ConversionTarget.NodePen;
                    }
                default:
                    throw new Exception($"Invalid conversion target requested: {code}");
            }
        }

        enum ConversionTarget
        {
            NodePen,
            Grasshopper
        }

    }

}
