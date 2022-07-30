using System;
using System.Collections.Generic;
using Grasshopper.Kernel;
using GH_IO.Serialization;

namespace NodePen.Converters
{

    public static class NodePenConvert
    {
        public static Dictionary<string, NodePenNodeTemplate> Templates = new Dictionary<string, NodePenNodeTemplate>();

        public static void Configure(List<NodePenNodeTemplate> templates)
        {
            Templates.Clear();

            foreach (NodePenNodeTemplate template in templates)
            {
                Templates.Add(template.Guid, template);
            }
        }

        public static NodePenDocument Serialize(GH_Archive archive)
        {
            NodePenDocument document = new NodePenDocument();

            var proxies = Grasshopper.Instances.ComponentServer.ObjectProxies;

            foreach (IGH_ObjectProxy proxy in proxies)
            {

                var instance = proxy.CreateInstance() as IGH_Component;

                if (instance == null)
                {
                    continue;
                }

                var parameters = instance.Params;

                foreach (var input in parameters.Input)
                {
                    var x = input.InstanceGuid;
                }
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