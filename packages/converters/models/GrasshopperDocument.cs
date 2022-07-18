using System;
using Grasshopper.Kernel;
using GH_IO.Serialization;

namespace NodePen.Converters
{

    public class GrasshopperDocument
    {

        public GH_Archive Archive { get; private set; }

        private readonly GH_Document _document = new GH_Document();

        public GH_Document Document
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

        public GrasshopperDocument(GH_Archive archive)
        {
            Archive = archive;
        }

        public GrasshopperDocument(string xml)
        {
            Archive = new GH_Archive();

            if (!Archive.Deserialize_Xml(xml))
            {
                throw new Exception("Failed to parse provided xml data as Grasshopper document.");
            };
        }

        public GrasshopperDocument(byte[] data)
        {
            Archive = new GH_Archive();

            if (!Archive.Deserialize_Binary(data))
            {
                throw new Exception("Failed to parse provided binary data as Grasshopper document.");
            }
        }

        public int GetObjectCount()
        {
            return Document.ObjectCount;
        }

    }

}