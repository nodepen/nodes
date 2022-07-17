using System;
using Topshelf;
using Microsoft.Owin.Hosting;
using Owin;
using Nancy.TinyIoc;
using Nancy.Bootstrapper;

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

            Console.WriteLine($"Grasshopper loaded! Found {Grasshopper.Instances.ComponentServer.ObjectProxies.Count} components in library.");

            base.ApplicationStartup(container, pipelines);
        }

    }

}
