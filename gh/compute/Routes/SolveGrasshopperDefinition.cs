using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Nancy;
using Nancy.Extensions;
using Newtonsoft.Json;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;
using GH_IO.Serialization;
using Rhino.Geometry;

namespace NodePen.Compute.Routes
{
  public partial class NodePenRoutes
  {
    public static Response SolveGrasshopperDefinition(NancyContext ctx)
    {
      var ghData = ctx.Request.Body.AsString();
      // var ghString = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(ghxData));

      var timer = new Stopwatch();

      var archive = new GH_Archive();
      archive.Deserialize_Binary(Convert.FromBase64String(ghData));
      // archive.Deserialize_Xml(ghxString);

      var definition = new GH_Document();
      archive.ExtractObject(definition, "Definition");

      definition.Enabled = true;

      timer.Start();

      definition.NewSolution(true, GH_SolutionMode.CommandLine);

      timer.Stop();

      var results = new List<SolutionData>();
      var messages = new List<SolutionMessage>();

      definition.Objects.ToList().ForEach(instance =>
      {

        if (instance.Category.ToLower() == "params")
        {
          // Gather any data
          var parameterInstance = instance as IGH_Param;

          var elementId = parameterInstance.InstanceGuid.ToString();
          var parameterId = "output";

          var data = ExtractSolutionData(parameterInstance, elementId, parameterId);
          results.Add(data);

          // Gather any messages
          if (parameterInstance.RuntimeMessageLevel == GH_RuntimeMessageLevel.Blank)
          {
            return;
          }

          var message = ExtractSolutionMessage(parameterInstance, elementId);
          messages.Add(message);
        }
        else 
        {
          // instance.GetType().Name.ToLower().Contains("component")
          // Gather any data
          var componentInstance = instance as IGH_Component;

          var elementId = componentInstance.InstanceGuid.ToString();

          var allParams = new List<IGH_Param>();
          allParams.AddRange(componentInstance.Params.Output);
          allParams.AddRange(componentInstance.Params.Input);

          allParams.ForEach(param =>
          {
            var data = ExtractSolutionData(param, elementId);
            results.Add(data);
          });

          // Gather any messages (i.e. warnings, errors)
          if (componentInstance.RuntimeMessageLevel == GH_RuntimeMessageLevel.Blank)
          {
            return;
          }

          var message = ExtractSolutionMessage(componentInstance, elementId);
          messages.Add(message);
        }

      });

      var response = new SolutionResponse();
      response.Data = results;
      response.Messages = messages;
      response.Duration = timer.ElapsedMilliseconds;

      return (Response)JsonConvert.SerializeObject(response);
    }

    private static SolutionData ExtractSolutionData(IGH_Param parameter, string elementId)
    {
      return ExtractSolutionData(parameter, elementId, parameter.InstanceGuid.ToString());
    }

    private static SolutionData ExtractSolutionData(IGH_Param parameter, string elementId, string parameterId)
    {
      var result = new SolutionData() {
        ElementId = elementId,
        ParameterId = parameterId,
      };

      for (var i = 0; i < parameter.VolatileData.PathCount; i++)
      {
        var currentPath = parameter.VolatileData.get_Path(i);
        var currentBranch = parameter.VolatileData.get_Branch(currentPath);

        var branchData = new SolutionDataBranch();
        branchData.Path = currentPath.Indices.ToList();

        for (var j = 0; j < currentBranch.Count; j++)
        {
          var goo = currentBranch[j] as IGH_Goo;

          if (goo == null)
          {
            // `goo` appears to be null, not absent, on invalid solutions
            continue;
          }

          var data = new SolutionDataValue();

          switch (goo.TypeName)
          {
            case "Boolean":
              {
                var boolGoo = goo as GH_Boolean;

                data.Type = "boolean";
                data.Value = boolGoo.Value.ToString().ToLower();

                break;
              }
            case "Circle":
              {
                var circleGoo = goo as GH_Circle;

                data.Type = "circle";

                var beziers = BezierCurve.CreateCubicBeziers(circleGoo.Value.ToNurbsCurve(), 0.01, 0.01);
                var curve = ToNodePenCurve(beziers);

                data.Value = JsonConvert.SerializeObject(curve);

                break;
              }
            case "Curve":
              {
                var curveGoo = goo as GH_Curve;

                data.Type = "curve";

                if (curveGoo.Value.Degree == 1)
                {
                  var curve = ToNodePenCurve(curveGoo.Value);

                  data.Value = JsonConvert.SerializeObject(curve);
                } else
                {
                  var beziers = BezierCurve.CreateCubicBeziers(curveGoo.Value, 0.01, 0.01);
                  var curve = ToNodePenCurve(beziers, curveGoo.Value.Degree);

                  data.Value = JsonConvert.SerializeObject(curve);
                }

                break;
              }
            case "Integer":
              {
                var integerGoo = goo as GH_Integer;

                data.Value = integerGoo.Value.ToString();
                data.Type = "integer";
                break;
              }
            case "Line":
              {
                var lineGoo = goo as GH_Line;

                var start = lineGoo.Value.From;
                var end = lineGoo.Value.To;

                var output = new NodePenLine()
                {
                  Start = new NodePenPoint()
                  {
                    X = start.X,
                    Y = start.Y,
                    Z = start.Z
                  },
                  End = new NodePenPoint()
                  {
                    X = end.X,
                    Y = end.Y,
                    Z = end.Z
                  }
                };

                data.Value = JsonConvert.SerializeObject(output);
                data.Type = "line";

                break;
              }
            case "Number":
              {
                var numberGoo = goo as GH_Number;

                data.Value = numberGoo.Value.ToString();
                data.Type = "number";
                break;
              }
            case "Point":
              {
                var pointGoo = goo as GH_Point;

                pointGoo.CastTo<Rhino.Geometry.Point3d>(out Point3d geo);

                var pointData = new NodePenPoint()
                {
                  X = geo.X,
                  Y = geo.Y,
                  Z = geo.Z
                };

                data.Value = JsonConvert.SerializeObject(pointData);
                data.Type = "point";
                break;
              }
            case "Text":
              {
                var textGoo = goo as GH_String;

                data.Value = textGoo.Value.ToString();
                data.Type = "text";
                break;
              }
            case "Vector":
              {
                var vectorGoo = goo as GH_Vector;

                var geo = vectorGoo.Value;

                var vectorData = new NodePenPoint()
                {
                  X = geo.X,
                  Y = geo.Y,
                  Z = geo.Z
                };

                data.Value = JsonConvert.SerializeObject(vectorData);
                data.Type = "vector";
                break;
              }
            default:
              {
                Console.WriteLine($"Using fallback parse for value type `{goo.TypeName}`");
                data.Value = JsonConvert.SerializeObject(goo);
                data.Type = "data";
                break;
              }
          }

          branchData.Data.Add(data);
        }

        result.Values.Add(branchData);
      }

      Console.WriteLine(result);

      return result;
    }

    private static SolutionMessage ExtractSolutionMessage(IGH_Param parameter, string elementId)
    {
      var message = new SolutionMessage();
      message.ElementId = elementId;
      message.Level = parameter.RuntimeMessageLevel.ToString().ToLower();
      message.Message = parameter.RuntimeMessages(parameter.RuntimeMessageLevel)[0];

      return message;
    }

    private static SolutionMessage ExtractSolutionMessage(IGH_Component component, string elementId)
    {
      var message = new SolutionMessage();
      message.ElementId = elementId;
      message.Level = component.RuntimeMessageLevel.ToString().ToLower();
      message.Message = component.RuntimeMessages(component.RuntimeMessageLevel)[0];

      return message;
    }

    public static NodePenCurve ToNodePenCurve(Curve curve)
    {
      var segmentCount = curve.SpanCount;

      var segments = new List<List<double>>();

      for (var i = 0; i < segmentCount; i++)
      {
        var currentSpan = curve.SpanDomain(i);

        var start = curve.PointAt(currentSpan.Min);
        var end = curve.PointAt(currentSpan.Max);

        var mid = start + end / 2;

        segments.Add(new List<double>
        {
          start.X,
          start.Y,
          start.Z,
          mid.X,
          mid.Y,
          mid.Z,
          mid.X,
          mid.Y,
          mid.Z,
          end.X,
          end.Y,
          end.Z
        });
      }

      var output = new NodePenCurve()
      {
        Degree = 1,
        Segments = segments
      };

      return output;
    }

    public static NodePenCurve ToNodePenCurve(BezierCurve[] beziers, int degree = 3)
    {
      var segments = beziers.Select((bezier) =>
      {
        var a = bezier.GetControlVertex3d(0);
        var b = bezier.GetControlVertex3d(1);
        var c = bezier.GetControlVertex3d(2);
        var d = bezier.GetControlVertex3d(3);

        return new List<double>
        {
          a.X,
          a.Y,
          a.Z,
          b.X,
          b.Y,
          b.Z,
          c.X,
          c.Y,
          c.Z,
          d.X,
          d.Y,
          d.Z
        };
      });

      var curve = new NodePenCurve()
      {
        Degree = degree,
        Segments = segments.ToList()
      };

      return curve;
    }

  }
}
