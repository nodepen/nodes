using Newtonsoft.Json;
using System;
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
      using (StreamReader r = new StreamReader("./appsettings.json"))
      {
        string json = r.ReadToEnd();
        var config = JsonConvert.DeserializeObject<EnvironmentVariables>(json);

        SpeckleEndpoint = config.SpeckleEndpoint;
        SpeckleToken = config.SpeckleToken;
        SpeckleStreamId = config.SpeckleStreamId;
      }
    }
  }

  public class EnvironmentVariables
  {
    public string SpeckleEndpoint { get; set; }
    public string SpeckleToken { get; set; }
    public string SpeckleStreamId { get; set; }
  }

}