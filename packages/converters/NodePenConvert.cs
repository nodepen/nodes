using System;
using System.Collections.Generic;
using Grasshopper.Kernel;
using GH_IO.Serialization;

namespace NodePen.Converters
{

    public static class NodePenConvert
    {
        public static Dictionary<string, NodePenNodeTemplate> Templates = new Dictionary<string, NodePenNodeTemplate>();

        /// <summary>
        /// Detect and initialize all components installed on the current Grasshopper instance.
        /// </summary>
        public static void Configure()
        {
            var templates = new List<NodePenNodeTemplate>();

            var proxies = Grasshopper.Instances.ComponentServer.ObjectProxies;

            foreach (var proxy in proxies)
            {
                if (proxy is IGH_Component component)
                {
                    Console.WriteLine(component.Params);
                }
                else
                {
                    Console.WriteLine(":(");
                }
            }
        }

        public static void ConfigureWith(List<NodePenNodeTemplate> templates)
        {
            Templates.Clear();

            foreach (NodePenNodeTemplate template in templates)
            {
                Templates.Add(template.Guid, template);
            }
        }

        public static NodePenDocument Serialize(byte[] data)
        {
            var archive = new GH_Archive();

            var document = archive.Deserialize_Binary(data)
                ? Serialize(archive)
                : throw new Exception("Failed to parse provided binary data as Grasshopper document.");

            return document;
        }

        public static NodePenDocument Serialize(GH_Archive archive)
        {
            NodePenDocument document = new NodePenDocument();

            var proxies = Grasshopper.Instances.ComponentServer.ObjectProxies;

            foreach (IGH_ObjectProxy proxy in proxies)
            {
                switch (proxy.Kind)
                {
                    case GH_ObjectType.CompiledObject:
                        {
                            if (proxy.CreateInstance() is GH_Component instance)
                            {
                                var type = instance.GetType();

                                for (var i = 0; i < instance.Params.Input.Count; i++)
                                {
                                    var inputParameter = instance.Params.Input[i];

                                }
                            }

                            continue;
                        }
                    case GH_ObjectType.UserObject:
                        {
                            var x = proxy.CreateInstance() as GH_UserObject;
                            continue;
                        }
                    case GH_ObjectType.None:
                    default:
                        {
                            continue;
                        }
                }

                // var instance = proxy.CreateInstance() as IGH_Component;

                // if (!(proxy.CreateInstance() is IGH_Component instance))
                // {
                //     continue;
                // }

                // if (instance == null)
                // {
                //     continue;
                // }

                // var parameters = instance.Params;

                // foreach (var input in parameters.Input)
                // {
                //     var x = input.InstanceGuid;
                // }
            }

            return document;
        }

        public static T Deserialize<T>(NodePenDocument document) where T : GH_Archive, new()
        {
            T archive = new T();

            return archive;

        }

    }

}