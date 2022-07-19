using System;
using System.Collections.Generic;

namespace NodePen.Converters
{

    public static class NodePenConvert
    {

        public static Dictionary<string, NodePenNodeTemplate> Templates { get; private set; } = new Dictionary<string, NodePenNodeTemplate>();

        public static void LoadLibrary(List<NodePenNodeTemplate> templates)
        {
            Templates.Clear();

            var x = new NodePenNodeTemplate()
            {
                Guid = "OK",
            };

            foreach (NodePenNodeTemplate template in templates)
            {
                Templates.Add(template.Guid, template);
            }
        }

        public static T From<T>(T sourceDocument) where T : class, IConverter
        {
            return Activator.CreateInstance(typeof(T), new[] { sourceDocument }) as T;
        }

    }

    public interface IConverter
    {
        IConverterTo To { get; set; }
    }

    public interface IConverterTo
    {

        NodePenDocument NodePenDocument();
        GrasshopperDocument GrasshopperDocument();

    }

    public class Test
    {

        public void Okay()
        {
            GrasshopperDocument doc = new GrasshopperDocument("ok");

            var gh = NodePenConvert.From(doc).To.NodePenDocument();
        }
    }
}