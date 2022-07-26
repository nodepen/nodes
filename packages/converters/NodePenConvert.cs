using System;
using System.Collections.Generic;
using Grasshopper.Kernel;
using GH_IO.Serialization;

namespace NodePen.Converters
{

    public static class NodePenConvert
    {

        public static GrasshopperDocumentConverterContext This(GH_Archive archive)
        {
            return new GrasshopperDocumentConverterContext(archive);
        }

    }

    public class NodePenConverterContext
    {

        private Dictionary<string, NodePenNodeTemplate> Library { get; set; } = new Dictionary<string, NodePenNodeTemplate>();

        public NodePenConverterContext()
        {

        }

        public NodePenConverterContext WithLibrary(Dictionary<string, NodePenNodeTemplate> library)
        {
            Library = library;
            return this;
        }

    }

    public class GrasshopperDocumentConverterContext : NodePenConverterContext
    {

        private GH_Archive Archive { get; set; }

        private readonly GH_Document _document = new GH_Document();

        private GH_Document Document
        {

            get
            {
                if (_document == null)
                {
                    if (!Archive.ExtractObject(_document, "Definition"))
                    {
                        throw new Exception("Failed to extract Grasshopper document from provided archive data.");
                    }
                }

                return _document;
            }

        }

        public GrasshopperDocumentConverterContext(GH_Archive archive)
        {
            Archive = archive;
        }

        public GrasshopperDocumentConverterContext(string xml)
        {
            Archive = new GH_Archive();

            if (!Archive.Deserialize_Xml(xml))
            {
                throw new Exception("Failed to parse provided xml data as Grasshopper document.");
            };
        }

        public GrasshopperDocumentConverterContext(byte[] data)
        {
            Archive = new GH_Archive();

            if (!Archive.Deserialize_Binary(data))
            {
                throw new Exception("Failed to parse provided binary data as Grasshopper document.");
            }
        }

        public NodePenDocument ToNodePenDocument()
        {
            NodePenDocument document = new NodePenDocument();

            return document;
        }
    }
}