using System;
using System.IO;
using System.Reflection;
using Xunit;
using Microsoft.Win32;
using RhinoInside;
using NodePen.Converters.Grasshopper;

namespace NodePen.Converters.Test
{

    public class UnitTest1
    {
        private static string rhinoDir;
        private static IDisposable RhinoCore { get; set; }

        public UnitTest1()
        {
            rhinoDir = Registry.GetValue(@"HKEY_LOCAL_MACHINE\SOFTWARE\McNeel\Rhinoceros\7.0\Install", "Path", null).ToString();
            Assert.True(Directory.Exists(rhinoDir) && rhinoDir.Length > 0, String.Format("Rhino system dir not found: {0}", rhinoDir));
            // throw new Exception(rhinoDir);
            RhinoInside.Resolver.Initialize();
            RhinoInside.Resolver.RhinoSystemDirectory = @"C:\Program Files\Rhino 7\System";
            // Console.WriteLine("OK");
            RhinoCore = new Rhino.Runtime.InProcess.RhinoCore(null, Rhino.Runtime.InProcess.WindowStyle.NoWindow);
        }

        [Fact]
        public void Test1()
        {
            Class1.Okay();
        }
    }

}

