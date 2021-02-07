using System;
using System.Collections.Generic;
using System.IO;
using Nancy;
using GH_IO.Serialization;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Grasshopper.Kernel.Data;
using Grasshopper.Kernel.Parameters;
using Rhino.Geometry;
using System.Reflection;
using System.Linq;
using System.Drawing;
using Nancy.Extensions;
using NodePen.Compute.Routes;

namespace NodePen.Compute
{
  public class ResthopperEndpointsModule : Nancy.NancyModule
  {

    public ResthopperEndpointsModule(Nancy.Routing.IRouteCacheProvider routeCacheProvider)
    {
      Get["/grasshopper"] = _ => NodePenRoutes.GetGrasshopperAssemblies(Context);
      Post["/grasshopper/graph"] = _ => CreateGrasshopperDefinition(Context);
      Post["/grasshopper/solve"] = _ => SolveGrasshopperDefinition(Context);
    }

    static Response CreateGrasshopperDefinition(NancyContext ctx)
    {
      var config = JsonConvert.DeserializeObject<List<dynamic>>(ctx.Request.Body.AsString());

      var ghdoc = new GH_Document();
      var proxies = Grasshopper.Instances.ComponentServer.ObjectProxies as List<IGH_ObjectProxy>;

      // In first pass, create all instances
      config.ForEach(element =>
      {
        var template = proxies.FirstOrDefault(proxy => proxy.Guid.ToString() == element.template.guid.ToString());

        if (template == null)
        {
          Console.Write("No proxy found.");
          return;
        }

        switch (element.template.type.ToString())
        {
          case "static-component":
            {
              var component = template.CreateInstance() as IGH_Component;
              component.NewInstanceGuid(new Guid(element.id.ToString()));

              var inputInstanceIds = (element.current.inputs as JObject).Properties().Select(p => p.Name).ToList();
              var outputInstanceIds = (element.current.outputs as JObject).Properties().Select(p => p.Name).ToList();

              for (var i = 0; i < component.Params.Input.Count; i++)
              {
                var instanceInputParam = component.Params.Input[i];
                instanceInputParam.NewInstanceGuid(new Guid(inputInstanceIds[i]));
              }

              for (var i = 0; i < component.Params.Output.Count; i++)
              {
                var instanceOutputParam = component.Params.Output[i];
                instanceOutputParam.NewInstanceGuid(new Guid(outputInstanceIds[i]));
              }

              var x = Convert.ToSingle(element.current.position[0].ToString());
              var y = Convert.ToSingle(element.current.position[1].ToString()) * -1;

              component.Attributes.Pivot = new PointF(x, y);

              ghdoc.AddObject(component, false);
              break;
            }
          case "static-parameter":
            {
              var parameter = template.CreateInstance() as IGH_Param;
              parameter.NewInstanceGuid(new Guid(element.id.ToString()));

              ghdoc.AddObject(parameter, false);

              var x = Convert.ToSingle(element.current.position[0].ToString());
              var y = Convert.ToSingle(element.current.position[1].ToString());

              // Attributes appear to be null before adding to document
              ghdoc.Objects.First(item => item.InstanceGuid.ToString() == element.id.ToString()).Attributes.Pivot = new PointF(x, y);

              break;
            }
        }
      });

      // In second pass, assign any sources
      config.ForEach(element =>
      {
        var instance = ghdoc.Objects.First(obj => obj.InstanceGuid.ToString() == element.id.ToString());

        switch (element.template.type.ToString())
        {
          case "static-component":
            {
              var componentInstance = instance as IGH_Component;

              JObject inputs = element.current.sources;

              inputs.Properties().ToList().ForEach(prop =>
              {
                var instanceInputId = prop.Name;

                var sources = (element.current.sources as JObject).GetValue(instanceInputId).ToObject<List<dynamic>>();

                sources.ForEach(source =>
                {
                  var sourceElementInstanceId = source.element.ToString();
                  var sourceElementParameterInstanceId = source.parameter.ToString();

                  // Grab component input instance
                  var instanceInput = componentInstance.Params.Input.First(input => input.InstanceGuid.ToString() == instanceInputId);

                  if (sourceElementParameterInstanceId == "output")
                  {
                    // Source is a parameter, add directly
                    var sourceInstance = ghdoc.Objects.First(obj => obj.InstanceGuid.ToString() == sourceElementInstanceId) as IGH_Param;

                    instanceInput.Sources.Add(sourceInstance);
                  }
                  else
                  {
                    // Grab source component
                    var sourceInstance = ghdoc.Objects.First(obj => obj.InstanceGuid.ToString() == sourceElementInstanceId) as IGH_Component;
                    var sourceInstanceParameter = sourceInstance.Params.Output.Find(param => param.InstanceGuid.ToString() == sourceElementParameterInstanceId);

                    instanceInput.Sources.Add(sourceInstanceParameter);
                  }
                });

              });
              break;
            }
          case "static-parameter":
            {
              var parameterInstance = instance as IGH_Param;

              var sources = (element.current.sources as JObject).GetValue("input").ToObject<List<dynamic>>();

              sources.ForEach(source =>
              {
                var sourceElementInstanceId = source.element.ToString();
                var sourceElementParameterInstanceId = source.parameter.ToString();

                if (sourceElementParameterInstanceId == "output")
                {
                  // Source is a parameter, add directly
                  var sourceInstance = ghdoc.Objects.First(obj => obj.InstanceGuid.ToString() == sourceElementInstanceId) as IGH_Param;

                  parameterInstance.Sources.Add(sourceInstance);
                }
                else
                {
                  // Grab source component
                  var sourceInstance = ghdoc.Objects.First(obj => obj.InstanceGuid.ToString() == sourceElementInstanceId) as IGH_Component;
                  var sourceInstanceParameter = sourceInstance.Params.Output.Find(param => param.InstanceGuid.ToString() == sourceElementParameterInstanceId);

                  parameterInstance.Sources.Add(sourceInstanceParameter);
                }
              });
              break;
            }
        }
      });

      // In third pass, assign any parameter values
      config.ForEach(element =>
      {
        if (element.template.type.ToString() != "static-parameter")
        {
          // TODO: Handle component values too
          return;
        }

        if (element.template.name.ToString() != "Number")
        {
          // TODO: Handle different param types
          return;
        }

        var instance = ghdoc.Objects.First(obj => obj.InstanceGuid.ToString() == element.id.ToString()) as Param_Number;

        JObject values = element.current.values;
        var tree = new GH_Structure<GH_Number>();

        values.Properties().ToList().ForEach(prop =>
        {
          var pathString = prop.Name;
          var pathIndices = pathString.Replace("{", "").Replace("}", "").Split(';').Select(num => Convert.ToInt32(num)).ToArray();
          
          var branch = new GH_Path(pathIndices);
            
          var pathValues = (element.current.values as JObject).GetValue(pathString).ToObject<List<dynamic>>();

          for (var i = 0; i < pathValues.Count; i++)
          {
            var pathValue = pathValues[i];
            var sourceType = pathValue.from.ToString();

            if (sourceType != "user")
            {
              // Value is computed, do not set as an override
              // TODO: Should the api sanitize element values before sending them to rhino?
              return;
            }

            switch (pathValue.type.ToString())
            {
              case "number":
                {
                  var numberParam = instance as Param_Number;

                  double value = Convert.ToDouble(pathValue.data.ToString());

                  var number = new GH_Number(value);

                  tree.Insert(number, branch, i);
                  
                  break;
                }
            }
          }
        });

        instance.SetPersistentData(tree);
      });

      // var path = "C:\\Users\\cdrie\\Desktop\\testing\\test.ghx";

      var archive = new GH_Archive();
      archive.AppendObject(ghdoc, "Definition");
      // archive.Path = path;
      // archive.WriteToFile(path, true, false);

      var bytes = System.Text.Encoding.UTF8.GetBytes(archive.Serialize_Xml());

      var response = (Response)Convert.ToBase64String(bytes);
      response.StatusCode = Nancy.HttpStatusCode.OK;
      response.ContentType = "text/plain";

      return response;
    }

    private class SolutionResponse
    {
      public List<SolutionData> Data { get; set; }
      public List<SolutionMessage> Messages { get; set; }
    }

    private class SolutionData
    {
      public string ElementId { get; set; }
      public string ParameterId { get; set; }
      public List<SolutionDataBranch> Values { get; set; } = new List<SolutionDataBranch>();
    }

    private class SolutionDataBranch
    {
      public List<int> Path { get; set; } = new List<int>();
      public List<SolutionDataValue> Data { get; set; } = new List<SolutionDataValue>();
    }

    private class SolutionDataValue
    {
      public string Value { get; set; }
      public string Type { get; set; }
    }

    private class SolutionMessage
    {
      public string ElementId { get; set; }
      public string Message { get; set; }
      public string Level { get; set; }
    }

    static Response SolveGrasshopperDefinition(NancyContext ctx)
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
