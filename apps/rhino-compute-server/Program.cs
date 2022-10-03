using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Topshelf;
using Microsoft.Owin.Hosting;
using Owin;
using Nancy;
using Nancy.TinyIoc;
using Nancy.Bootstrapper;
using NodePen.Converters;
using Grasshopper.Kernel;
using GH_IO.Serialization;
using Speckle.Core.Api;
using Speckle.Core.Models;
using Speckle.Core.Credentials;
using Speckle.Core.Transports;
using Speckle.Newtonsoft.Json;

namespace Rhino.Compute
{

    class Program
    {

        public static IDisposable RhinoCore { get; set; }

        public static async Task<string> TryThis()
        {
            var account = new Account()
            {
                token = "8ac998dd805648be63a69a8e0480d07a1e06c6465e",
                serverInfo = new ServerInfo()
                {
                    url = "http://localhost:3000",
                    company = "NodePen"
                },
                userInfo = new UserInfo()
                {
                    email = "chuck@nodepen.io"
                }
            };

            var streamId = "b0d3a3c122";

            var client = new Client(account);

            var transport = new ServerTransport(account, streamId);

            // var ok = await Helpers.Receive("http://localhost:3000/streams/b0d3a3c122/branches/main");
            // Console.WriteLine(Operations.Serialize(ok));

            var data = new Base();
            data["random"] = new Random().Next();

            var commitId = await Helpers.Send(
                stream: "http://localhost:3000/streams/b0d3a3c122/branches/main",
                data: data,
                message: "Test message",
                account: account
            );

            // var objectId = await Operations.Send(
            //     data,
            //     new List<ITransport> { transport },
            //     useDefaultCache: false,
            //     disposeTransports: false,
            //     onErrorAction: new Action<string, Exception>((a, b) =>
            //     {
            //         Console.WriteLine("Error:");
            //         Console.WriteLine(a);
            //         Console.WriteLine(b.Message);
            //     }),
            //     onProgressAction: new Action<System.Collections.Concurrent.ConcurrentDictionary<string, int>>((a) =>
            //     {
            //         Console.WriteLine("Progress:");

            //         foreach (var key in a.Keys)
            //         {
            //             a.TryGetValue(key, out var val);

            //             Console.WriteLine(key);
            //             Console.WriteLine(val);
            //         }
            //     })
            // );

            // Console.WriteLine($"Successful object creation {objectId}");

            // var commitId = await client.CommitCreate(
            //     new CommitCreateInput()
            //     {
            //         streamId = streamId,
            //         branchName = "main",
            //         objectId = objectId,
            //         message = "howdy!",
            //         sourceApplication = ".net",
            //         totalChildrenCount = 0
            //     }
            // );

            return commitId;
        }

        static void Main(string[] args)
        {
            RhinoInside.Resolver.Initialize();

            var commitId = TryThis().Result;
            Console.WriteLine(commitId);

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

            // var account = new Speckle.Core.Credentials.Account();


            // var streamUrl = "http://localhost:3000/streams/b0d3a3c122";

            // var commitId = TryThis().Result;

            // var commitId = client.CommitCreate(new CommitCreateInput()
            // {
            //     streamId = "b0d3a3c122",
            //     branchName = "main",
            //     objectId = "test",
            // }).Result;

            // Console.WriteLine(stream);

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

            var body = Request.Body;
            int length = (int)body.Length;
            byte[] data = new byte[length];
            body.Read(data, 0, length);

            // var document = new GrasshopperDocument(data);

            // Console.WriteLine($"Received .gh file with {document.GetObjectCount()} objects.");
            NodePenConvert.Configure();

            return (Response)JsonConvert.SerializeObject(NodePenConvert.Serialize(data));
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
                        return ConversionTarget.GrasshopperBinary;
                    }
                case "ghx":
                    {
                        return ConversionTarget.GrasshopperXML;
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
            GrasshopperBinary,
            GrasshopperXML,
        }

    }

}
