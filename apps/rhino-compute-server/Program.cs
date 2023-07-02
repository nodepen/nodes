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

      Speckle.Core.Logging.SpeckleLog.Initialize("NodePen", "0.0.0");

      Environment.Configure();

      HostFactory.Run((Host) =>
            {
              Host.Service<SelfHostService>();
              Host.SetDisplayName("NodePen");
            });
    }
  }

  internal partial class SelfHostService : ServiceControl
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

      NodePenConvert.Configure();

      Nancy.Json.JsonSettings.MaxJsonLength = int.MaxValue;

      base.ApplicationStartup(container, pipelines);
    }

    protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext context)
    {
      pipelines.AfterRequest.AddItemToEndOfPipeline((ctx) =>
      {
        ctx.Response.WithHeader("Access-Control-Allow-Origin", "*")
                              .WithHeader("Access-Control-Allow-Methods", "POST,GET")
                              .WithHeader("Access-Control-Allow-Headers", "Accept, Origin, Content-type");

      });
    }
  }

  public class LoggingErrorHandler : Nancy.ErrorHandling.IStatusCodeHandler
  {
    public bool HandlesStatusCode(HttpStatusCode statusCode, NancyContext context)
    {
      return statusCode == HttpStatusCode.InternalServerError;
    }

    public void Handle(HttpStatusCode statusCode, NancyContext context)
    {
      object errorObject;
      context.Items.TryGetValue(NancyEngine.ERROR_EXCEPTION, out errorObject);
      var error = errorObject as Exception;

      Console.WriteLine(error.Message);
      Console.WriteLine(error.Message);
      Console.WriteLine(error.Source);
    }
  }
}
