using Serilog;

namespace compute.geometry
{
  static class Logging
  {
    static bool _enabled = false;
    public static void Init()
    {
      if (_enabled)
      {
        return;
      }

      var logger = new LoggerConfiguration()
        .MinimumLevel.Debug()
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Source", "geometry")
        .WriteTo.Console(outputTemplate: "{Timestamp:o} {Level:w3}: {Source} {Message:lj} {Properties:j}{NewLine}{Exception}");

      Log.Logger = logger.CreateLogger();
      _enabled = true;
    }
  }
}
