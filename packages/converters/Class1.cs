using System;
using NodePen.Converters;
using GH_IO.Serialization;

namespace NodePen.Converters
{

    public class Class1
    {

        public static void Test()
        {
            Console.WriteLine($"Grasshopper loaded! Found {Grasshopper.Instances.ComponentServer.ObjectProxies.Count} components in library.");

            NodePenConvert.This(new GH_Archive()).WithLibrary()
        }

    }

}

