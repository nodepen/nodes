using System.Collections.Generic;
using Speckle.Core.Models;
using Objects.Converter.RhinoGh;
using Speckle.Core.Kits;
using System;
using Rhino;
using Grasshopper.Kernel.Types;

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

        public ReceiveMode ReceiveMode { get; set; } = ReceiveMode.Update;

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
            // Console.WriteLine($"{goo.TypeName} / {goo.GetType()}");

            switch (goo)
            {
                case GH_Arc arcGoo:
                    {
                        return ConvertGooToSpeckle(arcGoo);
                    }
                case GH_Boolean booleanGoo:
                    {
                        return ConvertGooToSpeckle(booleanGoo);
                    }
                case GH_Box boxGoo:
                    {
                        return ConvertGooToSpeckle(boxGoo);
                    }
                case GH_Brep brepGoo:
                    {
                        return ConvertGooToSpeckle(brepGoo);
                    }
                case GH_Circle circleGoo:
                    {
                        return ConvertGooToSpeckle(circleGoo);
                    }
                case GH_Colour colourGoo:
                    {
                        return ConvertGooToSpeckle(colourGoo);
                    }
                case GH_ComplexNumber complexNumberGoo:
                    {
                        return ConvertGooToSpeckle(complexNumberGoo);
                    }
                case GH_Culture cultureGoo:
                    {
                        return ConvertGooToSpeckle(cultureGoo);
                    }
                case GH_Curve curveGoo:
                    {
                        return ConvertGooToSpeckle(curveGoo);
                    }
                case GH_Guid guidGoo:
                    {
                        return ConvertGooToSpeckle(guidGoo);
                    }
                case GH_Integer intGoo:
                    {
                        return ConvertGooToSpeckle(intGoo);
                    }
                case GH_Interval intervalGoo:
                    {
                        return ConvertGooToSpeckle(intervalGoo);
                    }
                case GH_Interval2D interval2dGoo:
                    {
                        return ConvertGooToSpeckle(interval2dGoo);
                    }
                case GH_Line lineGoo:
                    {
                        return ConvertGooToSpeckle(lineGoo);
                    }
                case GH_Material materialGoo:
                    {
                        return ConvertGooToSpeckle(materialGoo);
                    }
                case GH_Matrix matrixGoo:
                    {
                        return ConvertGooToSpeckle(matrixGoo);
                    }
                case GH_Mesh meshGoo:
                    {
                        return ConvertGooToSpeckle(meshGoo);
                    }
                case GH_MeshFace meshFaceGoo:
                    {
                        return ConvertGooToSpeckle(meshFaceGoo);
                    }
                case GH_MeshingParameters meshingParametersGoo:
                    {
                        return ConvertGooToSpeckle(meshingParametersGoo);
                    }
                case GH_Number numberGoo:
                    {
                        return ConvertGooToSpeckle(numberGoo);
                    }
                case GH_Plane planeGoo:
                    {
                        return ConvertGooToSpeckle(planeGoo);
                    }
                case GH_Point pointGoo:
                    {
                        var entrySolutionValue = new NodePenDataTreeValue()
                        {
                            Type = pointGoo.TypeName.ToLower(),
                            Description = pointGoo.ToString(),
                            Value = pointGoo.Value.ToString(),
                            Geometry = BaseConverter.PointToSpeckle(pointGoo.Value)
                        };

                        return entrySolutionValue;
                    }
                case GH_Rectangle rectangleGoo:
                    {
                        return ConvertGooToSpeckle(rectangleGoo);
                    }
                case GH_String stringGoo:
                    {
                        return ConvertGooToSpeckle(stringGoo);
                    }
                case GH_SubD subdGoo:
                    {
                        return ConvertGooToSpeckle(subdGoo);
                    }
                case GH_Surface surfaceGoo:
                    {
                        return ConvertGooToSpeckle(surfaceGoo);
                    }
                case GH_Time timeGoo:
                    {
                        return ConvertGooToSpeckle(timeGoo);
                    }
                case GH_Transform transformGoo:
                    {
                        return ConvertGooToSpeckle(transformGoo);
                    }
                case GH_Vector vectorGoo:
                    {
                        return ConvertGooToSpeckle(vectorGoo);
                    }
                default:
                    {
                        Console.WriteLine($"Using default conversion for {goo.TypeName} value!");

                        var entrySolutionValue = new NodePenDataTreeValue()
                        {
                            Type = goo.TypeName.ToLower(),
                            Description = goo.ToString(),
                            Value = null,
                            Geometry = null,
                        };

                        return entrySolutionValue;
                    }
            }

            throw new Exception($"Failed to convert {goo.TypeName}");
        }

        public NodePenDataTreeValue ConvertGooToSpeckle<T>(GH_Goo<T> goo, bool serializeNative = true, bool serializeSpeckle = true)
        {
            var nativeGeometry = goo.Value;

            var entrySolutionValue = new NodePenDataTreeValue()
            {
                Type = goo.TypeName.ToLower(),
                Description = goo.ToString(),
                Value = null,
                Geometry = null,
            };

            if (serializeNative)
            {
                entrySolutionValue.Value = nativeGeometry.ToString();
            }

            if (serializeSpeckle)
            {
                entrySolutionValue.Geometry = BaseConverter.ConvertToSpeckle(nativeGeometry);
            }

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