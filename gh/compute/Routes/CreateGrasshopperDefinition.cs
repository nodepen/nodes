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
using Grasshopper.Kernel.Special;
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
      public NodePenElementState Current { get; set; }
    }

    private class NodePenTemplate : GrasshopperComponent
    {
      [JsonProperty("type")]
      public string Type { get; set; }
    }

    private class NodePenElementState
    {
      [JsonProperty("position")]
      public List<double> Position { get; set; }

      [JsonProperty("sources")]
      public Dictionary<string, List<NodePenElementSource>> Sources { get; set; }

      [JsonProperty("inputs")]
      public Dictionary<string, int> Inputs { get; set; }

      [JsonProperty("outputs")]
      public Dictionary<string, int> Outputs { get; set; }

      [JsonProperty("values")]
      public dynamic Values { get; set; }

      // Number Slider properties
      [JsonProperty("domain")]
      public List<decimal> Domain { get; set; } = new List<decimal>();

      [JsonProperty("precision")]
      public int? Precision { get; set; }
    }

    private class NodePenElementSource
    {
      [JsonProperty("element")]
      public string Element { get; set; }

      [JsonProperty("parameter")]
      public string Parameter { get; set; }
    }

    public static Response CreateGrasshopperDefinition(NancyContext ctx)
    {
      var body = ctx.Request.Body.AsString();
      var config = JsonConvert.DeserializeObject<List<NodePenElement>>(body);

      var ghdoc = new GH_Document();
      var proxies = Grasshopper.Instances.ComponentServer.ObjectProxies as List<IGH_ObjectProxy>;

      // In first pass, create all instances
      config.ForEach(element =>
      {
        var template = proxies.FirstOrDefault(proxy => proxy.Guid.ToString() == element.Template.Guid);

        if (template == null)
        {
          Console.Write($"No proxy found for {element.Template.Name} in {element.Template.LibraryName}.");
          return;
        }

        switch (element.Template.Type)
        {
          case "static-component":
            {
              var component = template.CreateInstance() as IGH_Component;
              component.NewInstanceGuid(new Guid(element.Id));

              var inputInstanceIds = element.Current.Inputs.Keys.ToList();
              var outputInstanceIds = element.Current.Outputs.Keys.ToList();

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

              var x = Convert.ToSingle(element.Current.Position[0]);
              var y = Convert.ToSingle(element.Current.Position[1]) * -1;

              component.Attributes.Pivot = new PointF(x, y);

              ghdoc.AddObject(component, false);
              break;
            }
          case "static-parameter":
            {
              var parameter = template.CreateInstance() as IGH_Param;
              parameter.NewInstanceGuid(new Guid(element.Id));

              ghdoc.AddObject(parameter, false);

              var x = Convert.ToSingle(element.Current.Position[0]);
              var y = Convert.ToSingle(element.Current.Position[1]);

              // Attributes appear to be null before adding to document
              ghdoc.Objects.First(item => item.InstanceGuid.ToString() == element.Id.ToString()).Attributes.Pivot = new PointF(x, y);

              break;
            }
          case "number-slider":
            {
              var slider = template.CreateInstance() as GH_NumberSlider;
              slider.NewInstanceGuid(new Guid(element.Id));

              ghdoc.AddObject(slider, false);

              var x = Convert.ToSingle(element.Current.Position[0]);
              var y = Convert.ToSingle(element.Current.Position[1]);

              var sliderInstance = ghdoc.Objects.First(item => item.InstanceGuid.ToString() == element.Id) as GH_NumberSlider;

              sliderInstance.Attributes.Pivot = new PointF(x, y);

              var precision = element.Current.Precision ?? 0;
              sliderInstance.Slider.Type = precision == 0 ? Grasshopper.GUI.Base.GH_SliderAccuracy.Integer : Grasshopper.GUI.Base.GH_SliderAccuracy.Float;
              sliderInstance.Slider.DecimalPlaces = precision;

              var domain = element.Current.Domain;
              sliderInstance.Slider.Minimum = domain[0];
              sliderInstance.Slider.Maximum = domain[1];

              sliderInstance.Slider.FixDomain();

              var incoming = Convert.ToString(element.Current.Values["{0}"][0].data);
              var success = decimal.TryParse(incoming, out decimal value);

              sliderInstance.SetSliderValue(success ? value : 5);

              sliderInstance.Slider.FixValue();

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

              element.Current.Sources.Keys.ToList().ForEach(instanceInputId =>
              {
                element.Current.Sources.TryGetValue(instanceInputId, out var sources);

                sources.ForEach(source =>
                {
                  var sourceElementInstanceId = source.Element;
                  var sourceElementParameterInstanceId = source.Parameter;

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

              element.Current.Sources.TryGetValue("input", out var sources);

              sources.ForEach(source =>
              {
                var sourceElementInstanceId = source.Element;
                var sourceElementParameterInstanceId = source.Parameter;

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

        JObject values = element.Current.Values;
        var tree = new GH_Structure<GH_Number>();

        values.Properties().ToList().ForEach(prop =>
        {
          var pathString = prop.Name;
          var pathCrumbs = pathString.Replace("{", "").Replace("}", "").Split(';').ToList().Where(key => key.Length > 0);
          var pathIndices = pathCrumbs.Select(num => Convert.ToInt32(num)).ToArray();

          var branch = new GH_Path(pathIndices);

          var pathValues = (element.Current.Values as JObject).GetValue(pathString).ToObject<List<dynamic>>();

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

                  var candidate = pathValue.data.ToString();

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

      var xml = archive.Serialize_Xml();

      var bytes = System.Text.Encoding.UTF8.GetBytes(xml);

      var data = Convert.ToBase64String(bytes);

      var response = (Response)data;
      response.StatusCode = Nancy.HttpStatusCode.OK;
      response.ContentType = "text/plain";

      return response;
    }
  }
}
