using System.Collections.Generic;
using Speckle.Core.Models;
using Objects.Converter.RhinoGh;
using Speckle.Core.Kits;
using NodePen.Converters;
using System;
using Grasshopper.Kernel.Types;

namespace Rhino.Compute.Kits
{

  public class NodePenRhinoConverter : ISpeckleConverter
  {

    private readonly ConverterRhinoGh BaseConverter = new ConverterRhinoGh();

    public string Description => "NodePen Rhino converter";
    public string Name => "NodePen Rhino Converter";
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

    public NodePenDataTreeValue ConvertToSpeckle(object @object, NodePenDataTreeValue output)
    {
      Base speckleObject = BaseConverter.ConvertToSpeckle(@object);
      output["test"] = speckleObject;

      return output;
    }

    public List<Base> ConvertToSpeckle(List<object> objects)
    {
      return BaseConverter.ConvertToSpeckle(objects);
    }

    public Base ConvertToSpeckle(object @object)
    {
      Base el = BaseConverter.ConvertToSpeckle(@object);
      Console.WriteLine("Speckle result:");
      Console.WriteLine(el);

      return el;
    }

    public NodePenDataTreeValue ConvertToSpeckle(IGH_Goo goo)
    {
      switch (goo)
      {
        case GH_Circle circleGoo:
          {
            Geometry.Circle circleNativeGeometry = circleGoo.Value;
            Objects.Geometry.Circle circleSpeckleGeometry = BaseConverter.CircleToSpeckle(circleNativeGeometry);

            NodePenDataTreeValue entrySolutionValue = new NodePenDataTreeValue()
            {
              Type = "Circle",
              Value = circleSpeckleGeometry,
            };

            return entrySolutionValue;
          }
        default:
          {
            throw new NotImplementedException();
          }
      }
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