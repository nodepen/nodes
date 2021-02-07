using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Nancy;
using Nancy.Extensions;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Data;
using Grasshopper.Kernel.Types;
using Grasshopper.Kernel.Parameters;
using GH_IO.Serialization;

namespace NodePen.Compute.Routes
{
  public partial class NodePenRoutes
  {
    private class NodePenElement {
      [JsonProperty("id")]
      public string Id { get; set; }

      [JsonProperty("template")]
      public NodePenTemplate Template { get; set; }

      [JsonProperty("current")]
      public dynamic current { get; set; }
    }

    private class NodePenTemplate : GrasshopperComponent
    {
      [JsonProperty("type")]
      public string Type { get; set; }
    }

    public static Response CreateGrasshopperDefinition(NancyContext ctx)
    {
      var body = ctx.Request.Body.AsString();
      var config = JsonConvert.DeserializeObject<List<NodePenElement>>(body);
      // Console.WriteLine(config);

      var ghdoc = new GH_Document();
      var proxies = Grasshopper.Instances.ComponentServer.ObjectProxies as List<IGH_ObjectProxy>;

      // In first pass, create all instances
      config.ForEach(element =>
      {
        var template = proxies.FirstOrDefault(proxy => proxy.Guid.ToString() == element.Template.Guid.ToString());

        if (template == null)
        {
          Console.Write("No proxy found.");
          return;
        }

        switch (element.Template.Type)
        {
          case "static-component":
            {
              var component = template.CreateInstance() as IGH_Component;
              component.NewInstanceGuid(new Guid(element.Id.ToString()));

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
              parameter.NewInstanceGuid(new Guid(element.Id.ToString()));

              ghdoc.AddObject(parameter, false);

              var x = Convert.ToSingle(element.current.position[0].ToString());
              var y = Convert.ToSingle(element.current.position[1].ToString());

              // Attributes appear to be null before adding to document
              ghdoc.Objects.First(item => item.InstanceGuid.ToString() == element.Id.ToString()).Attributes.Pivot = new PointF(x, y);

              break;
            }
        }
      });

      // In second pass, assign any sources
      config.ForEach(element =>
      {
        var instance = ghdoc.Objects.First(obj => obj.InstanceGuid.ToString() == element.Id.ToString());

        switch (element.Template.Type.ToString())
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
        if (element.Template.Type.ToString() != "static-parameter")
        {
          // TODO: Handle component values too
          return;
        }

        if (element.Template.Name.ToString() != "Number")
        {
          // TODO: Handle different param types
          return;
        }

        var instance = ghdoc.Objects.First(obj => obj.InstanceGuid.ToString() == element.Id.ToString()) as Param_Number;

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

      var data = Convert.ToBase64String(bytes);

      Console.WriteLine(data);

      var response = (Response)data;
      response.StatusCode = Nancy.HttpStatusCode.OK;
      response.ContentType = "text/plain";

      return response;
    }
  }
}
