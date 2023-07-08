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
  internal class Program
  {
    public static IDisposable RhinoCore { get; set; }

    private static void Main(string[] args)
    {
      RhinoInside.Resolver.Initialize();

      Speckle.Core.Logging.SpeckleLog.Initialize("NodePen", "0.0.0");

      Environment.Configure();

      _ = HostFactory.Run((Host) =>
            {
              _ = Host.Service<SelfHostService>();
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
      Program.RhinoCore = new Runtime.InProcess.RhinoCore(null, Runtime.InProcess.WindowStyle.NoWindow);

      // Start web server
      StartOptions options = new StartOptions();
      options.Urls.Add("http://localhost:6500");

      _ = WebApp.Start<Startup>(options);

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
      _ = app.UseNancy();
    }
  }

  public class Bootstrapper : DefaultNancyBootstrapper
  {
    protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
    {
      // Load Grasshopper
      object pluginObject = RhinoApp.GetPlugInObject("Grasshopper");
      System.Reflection.MethodInfo runheadless = pluginObject?.GetType().GetMethod("RunHeadless");
      _ = (runheadless?.Invoke(pluginObject, null));

      NodePenConvert.Configure();

      RhinoDoc contextDoc = RhinoDoc.Create(null);
      contextDoc.AdjustModelUnitSystem(UnitSystem.Meters, false);
      Environment.Converter.SetContextDocument(contextDoc);

      Nancy.Json.JsonSettings.MaxJsonLength = int.MaxValue;

      base.ApplicationStartup(container, pipelines);
    }

    protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext context)
    {
      pipelines.AfterRequest.AddItemToEndOfPipeline((ctx) =>
      {
        _ = ctx.Response.WithHeader("Access-Control-Allow-Origin", "*")
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
      _ = context.Items.TryGetValue(NancyEngine.ERROR_EXCEPTION, out object errorObject);
      Exception error = errorObject as Exception;

      Console.WriteLine(error.Message);
      Console.WriteLine(error.Message);
      Console.WriteLine(error.Source);
    }
  }
}
