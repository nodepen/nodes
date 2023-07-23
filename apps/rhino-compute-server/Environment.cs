using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using NodePen.Converters.Kits;

namespace Rhino.Compute
{
  public static class Environment
  {
    public static string SpeckleEndpoint { get; set; } = "";
    public static string SpeckleToken { get; set; } = "";
    public static string SpeckleStreamId { get; set; } = "";

    public static NodePenDocumentSolutionDataKit Converter { get; set; } = new NodePenDocumentSolutionDataKit();

    public static void Configure()
    {
      List<string> configFilePaths = new List<string>() {
        "./appsettings.json",
        "./appsettings.local.json"
      };

      foreach (string path in configFilePaths)
      {
        if (!File.Exists(path))
        {
          continue;
        }

        using (StreamReader r = new StreamReader(path))
        {
          string json = r.ReadToEnd();
          EnvironmentVariables config = JsonConvert.DeserializeObject<EnvironmentVariables>(json);

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