using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace Rhino.Compute
{

  public static class Environment
  {

    public static string SpeckleEndpoint { get; set; } = "";
    public static string SpeckleToken { get; set; } = "";
    public static string SpeckleStreamId { get; set; } = "";

    public static void Configure()
    {
      var configFilePaths = new List<string>() {
        "./appsettings.json",
        "./appsettings.local.json"
      };

      foreach (var path in configFilePaths)
      {
        if (!File.Exists(path))
        {
          continue;
        }

        using (StreamReader r = new StreamReader(path))
        {
          string json = r.ReadToEnd();
          var config = JsonConvert.DeserializeObject<EnvironmentVariables>(json);

          SpeckleEndpoint = config.SpeckleEndpoint;
          SpeckleToken = config.SpeckleToken;
          SpeckleStreamId = config.SpeckleStreamId;
        }
      }

      Console.WriteLine("Starting server with Speckle configuration:");
      Console.WriteLine($"Endpoint: {SpeckleEndpoint}");
      Console.WriteLine($"Stream: {SpeckleStreamId}");
      Console.WriteLine($"Token: {SpeckleToken.Substring(0, 4)}...");
    }
  }

  public class EnvironmentVariables
  {
    public string SpeckleEndpoint { get; set; }
    public string SpeckleToken { get; set; }
    public string SpeckleStreamId { get; set; }
  }

}