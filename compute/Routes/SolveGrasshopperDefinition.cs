using System;
using System.Collections.Generic;
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
      var ghxData = ctx.Request.Body.AsString();
      var ghxString = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(ghxData));

      var archive = new GH_Archive();
      archive.Deserialize_Xml(ghxString);

      var definition = new GH_Document();
      archive.ExtractObject(definition, "Definition");

      definition.Enabled = true;
      definition.NewSolution(true, GH_SolutionMode.CommandLine);

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
        else if (instance.GetType().Name.ToLower().Contains("component"))
        {
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

      return (Response)JsonConvert.SerializeObject(response);
    }

    private static SolutionData ExtractSolutionData(IGH_Param parameter, string elementId)
    {
      return ExtractSolutionData(parameter, elementId, parameter.InstanceGuid.ToString());
    }

    private static SolutionData ExtractSolutionData(IGH_Param parameter, string elementId, string parameterId)
    {
      var result = new SolutionData();
      result.ElementId = elementId;
      result.ParameterId = parameterId;

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

                data.Value = JsonConvert.SerializeObject(geo);
                data.Type = "point";
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
      message.Level = component.RuntimeMessageLevel.ToString();
      message.Message = component.RuntimeMessages(component.RuntimeMessageLevel)[0];

      return message;
    }

  }
}
