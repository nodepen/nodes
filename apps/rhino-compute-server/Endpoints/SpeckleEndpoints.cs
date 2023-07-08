using Nancy;
using Nancy.Routing;
using System;
using Speckle.Core.Api;
using Speckle.Core.Credentials;

namespace Rhino.Compute
{
  public class SpeckleEndpointsModule : NancyModule
  {
    public SpeckleEndpointsModule(IRouteCacheProvider routeCacheProvider)
    {
      Get["/streams/{id}"] = _ => GetStreamInfo(Context);
      Get["/streams/{id}/objects"] = _ => GetStreamObjects(Context);
    }

    public Response GetStreamInfo(NancyContext context)
    {
      string id = context.Parameters.id;
      Console.WriteLine(id);

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

      var streamDomain = "http://localhost:3000";
      var streamId = "b0d3a3c122";

      var streamUrl = $"{streamDomain}/streams/{streamId}/branches/main";

      var objectData = Helpers.Receive(
          stream: streamUrl,
          account: account
      ).Result;

      return Operations.Serialize(objectData);
    }

    public Response GetStreamObjects(NancyContext context)
    {
      var streamId = "b0d3a3c122";
      var branchName = "main";

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

      var client = new Client(account);

      var branch = client.BranchGet(streamId, branchName, 1).Result;
      var objectId = branch.commits.items[0].referencedObject;

      Console.WriteLine(branch.commits.items[0].id);
      Console.WriteLine(branch.commits.items[0].referencedObject);

      return (Response)objectId;
    }
  }
}