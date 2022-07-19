using System;
using Grasshopper.Kernel;
using GH_IO.Serialization;

namespace NodePen.Converters
{

    public class GrasshopperDocument : IConverter
    {

        private GH_Archive Archive { get; set; }

        private readonly GH_Document _document = new GH_Document();

        private new GH_Document Document
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

        public IConverterTo To { get; set; }

        public GrasshopperDocument(GH_Archive archive)
        {
            Archive = archive;

            To = new GrasshopperDocumentConvertTo(this);
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

    public class GrasshopperDocumentConvertTo : IConverterTo
    {

        private GrasshopperDocument Document { get; set; }

        public GrasshopperDocumentConvertTo(GrasshopperDocument document)
        {
            Document = document;
        }

        public NodePenDocument NodePenDocument()
        {
            throw new NotImplementedException();
        }

        public GrasshopperDocument GrasshopperDocument()
        {
            throw new NotImplementedException();
        }
    }

}