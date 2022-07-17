using System;
using Grasshopper;

namespace NodePen.Converters
{

    public class Class1
    {

        public static void Test()
        {
            Console.WriteLine($"Grasshopper loaded! Found {Grasshopper.Instances.ComponentServer.ObjectProxies.Count} components in library.");
        }

    }

}

