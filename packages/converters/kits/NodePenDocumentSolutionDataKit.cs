using System.Collections.Generic;
using Speckle.Core.Models;
using Objects.Converter.RhinoGh;
using Speckle.Core.Kits;
using NodePen.Converters;
using System;
using Rhino;
using Grasshopper.Kernel.Types;
using Newtonsoft.Json;
using Rhino.Geometry;

namespace NodePen.Converters.Kits
{

    public class NodePenDocumentSolutionDataKit : ISpeckleConverter
    {

        private readonly ConverterRhinoGh BaseConverter = new ConverterRhinoGh();

        public string Description => "Converts Grasshopper results to Speckle-flavored NodePen solution data.";
        public string Name => "NodePen Document SolutionData Converter";
        public string Author => "NodePen";
        public string WebsiteOrEmail => "https://nodepen.io";

        public ProgressReport Report => BaseConverter.Report;

        public ReceiveMode ReceiveMode { get; set; }

        public bool CanConvertToNative(Base @object)
        {
            return BaseConverter.CanConvertToNative(@object);
        }

        public bool CanConvertToSpeckle(object @object)
        {
            return BaseConverter.CanConvertToSpeckle(@object);
        }

        public object ConvertToNative(Base @object)
        {
            return BaseConverter.ConvertToNative(@object);
        }

        public List<object> ConvertToNative(List<Base> objects)
        {
            throw new NotImplementedException();
        }

        public Base ConvertToSpeckle(object @object)
        {
            throw new NotImplementedException();
        }

        public List<Base> ConvertToSpeckle(List<object> objects)
        {
            throw new NotImplementedException();
        }

        public NodePenDataTreeValue ConvertToSpeckle(IGH_Goo goo)
        {
            switch (goo)
            {
                case GH_Arc arcGoo:
                    {
                        return ConvertToSpeckle(arcGoo);
                    }
                case GH_Boolean booleanGoo:
                    {
                        return ConvertToSpeckle(booleanGoo);
                    }
                case GH_Box boxGoo:
                    {
                        return ConvertToSpeckle(boxGoo);
                    }
                case GH_Brep brepGoo:
                    {
                        return ConvertToSpeckle(brepGoo);
                    }
                case GH_Circle circleGoo:
                    {
                        return ConvertToSpeckle(circleGoo);
                    }
                case GH_Colour colourGoo:
                    {
                        return ConvertToSpeckle(colourGoo);
                    }
                case GH_ComplexNumber complexNumberGoo:
                    {
                        return ConvertToSpeckle(complexNumberGoo);
                    }
                case GH_Culture cultureGoo:
                    {
                        return ConvertToSpeckle(cultureGoo);
                    }
                case GH_Curve curveGoo:
                    {
                        return ConvertToSpeckle(curveGoo);
                    }
                case GH_Field fieldGoo:
                    {
                        return ConvertToSpeckle(fieldGoo);
                    }
                case GH_Guid guidGoo:
                    {
                        return ConvertToSpeckle(guidGoo);
                    }
                case GH_Integer intGoo:
                    {
                        return ConvertToSpeckle(intGoo);
                    }
                case GH_Interval intervalGoo:
                    {
                        return ConvertToSpeckle(intervalGoo);
                    }
                case GH_Interval2D interval2dGoo:
                    {
                        return ConvertToSpeckle(interval2dGoo);
                    }
                case GH_Line lineGoo:
                    {
                        return ConvertToSpeckle(lineGoo);
                    }
                case GH_Material materialGoo:
                    {
                        return ConvertToSpeckle(materialGoo);
                    }
                case GH_Matrix matrixGoo:
                    {
                        return ConvertToSpeckle(matrixGoo);
                    }
                case GH_Mesh meshGoo:
                    {
                        return ConvertToSpeckle(meshGoo);
                    }
                case GH_MeshFace meshFaceGoo:
                    {
                        return ConvertToSpeckle(meshFaceGoo);
                    }
                case GH_MeshingParameters meshingParametersGoo:
                    {
                        return ConvertToSpeckle(meshingParametersGoo);
                    }
                case GH_Number numberGoo:
                    {
                        return ConvertToSpeckle(numberGoo);
                    }
                case GH_Plane planeGoo:
                    {
                        return ConvertToSpeckle(planeGoo);
                    }
                case GH_Point pointGoo:
                    {
                        return ConvertToSpeckle(pointGoo);
                    }
                case GH_Rectangle rectangleGoo:
                    {
                        return ConvertToSpeckle(rectangleGoo);
                    }
                case GH_String stringGoo:
                    {
                        return ConvertToSpeckle(stringGoo);
                    }
                case GH_SubD subdGoo:
                    {
                        return ConvertToSpeckle(subdGoo);
                    }
                case GH_Surface surfaceGoo:
                    {
                        return ConvertToSpeckle(surfaceGoo);
                    }
                case GH_Time timeGoo:
                    {
                        return ConvertToSpeckle(timeGoo);
                    }
                case GH_Transform transformGoo:
                    {
                        return ConvertToSpeckle(transformGoo);
                    }
                case GH_Vector vectorGoo:
                    {
                        return ConvertToSpeckle(vectorGoo);
                    }
                default:
                    {
                        throw new Exception($"Failed to convert {goo.TypeName} value!");
                    }
            }

            throw new Exception($"Failed to convert {goo.TypeName}");
        }

        public NodePenDataTreeValue ConvertToSpeckle<T>(GH_Goo<T> goo)
        {
            var nativeGeometry = goo.Value;
            var speckleGeometry = BaseConverter.ConvertToSpeckle(nativeGeometry);

            var entrySolutionValue = new NodePenDataTreeValue()
            {
                Type = goo.TypeName.ToLower(),
                Description = goo.ToString(),
                NativeValue = nativeGeometry.ToString(),
                NativeGeometry = nativeGeometry,
                SpeckleGeometry = speckleGeometry,
            };

            return entrySolutionValue;
        }

        public IEnumerable<string> GetServicedApplications()
        {
            return BaseConverter.GetServicedApplications();
        }

        public void SetContextDocument(object obj)
        {
            throw new NotImplementedException();
        }

        public void SetContextDocument(RhinoDoc doc)
        {
            BaseConverter.SetContextDocument(doc);
        }

        public void SetContextObjects(List<ApplicationObject> objects)
        {
            throw new NotImplementedException();
        }

        public void SetConverterSettings(object settings)
        {
            throw new NotImplementedException();
        }

        public void SetPreviousContextObjects(List<ApplicationObject> objects)
        {
            throw new NotImplementedException();
        }

        // public void SetContextObjects(List<ApplicationPlaceholderObject> objects)
        // {
        //   BaseConverter.SetContextObjects(objects);
        // }

        // public void SetConverterSettings(object settings)
        // {
        //   BaseConverter.SetConverterSettings(settings);
        // }

        // public void SetPreviousContextObjects(List<ApplicationPlaceholderObject> objects)
        // {
        //   BaseConverter.SetPreviousContextObjects(objects);
        // }

    }

}