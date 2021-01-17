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
using Resthopper.IO;
using Grasshopper.Kernel.Parameters;
using Grasshopper.Kernel.Special;
using Rhino.Geometry;
using System.Net;
using System.Reflection;
using System.Linq;
using System.Drawing;
using Nancy.Extensions;
using Rhino.FileIO;

namespace compute.geometry
{

  [JsonObject(MemberSerialization.OptOut)]
  public class ResthopperComponent
  {
    public string Guid { get; set; }
    public string Name { get; set; }
    public string NickName { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public string Subcategory { get; set; }
    public bool IsObsolete { get; set; }
    public bool IsVariable { get; set; }
    public string Icon { get; set; }
    public List<ResthopperComponentParameter> Inputs { get; set; }
    public List<ResthopperComponentParameter> Outputs { get; set; }

    public string LibraryName { get; set; }

    public ResthopperComponent()
    {
      Inputs = new List<ResthopperComponentParameter>();
      Outputs = new List<ResthopperComponentParameter>();
    }
  }

  [JsonObject(MemberSerialization.OptOut)]
  public class ResthopperComponentParameter
  {
    public string Name { get; set; }
    public string NickName { get; set; }
    public string Description { get; set; }
    public bool IsOptional { get; set; }
    public string TypeName { get; set; }

    public ResthopperComponentParameter(IGH_Param param)
    {
      Name = param.Name;
      NickName = param.NickName;
      Description = param.Description;
      IsOptional = param.Optional;
      TypeName = param.TypeName;
    }
  }

  // Container classes from Resthopper javascript library.
  public class GrasshopperDocument
  {
    public List<string> Targets { get; set; } = new List<string>();
    public List<GrasshopperComponent> Components { get; set; } = new List<GrasshopperComponent>();
  }

  public class GrasshopperComponent
  {
    public string Name { get; set; }
    public string Guid { get; set; }
    public GrasshopperPosition Position { get; set; }
    public List<GrasshopperParameter> Inputs = new List<GrasshopperParameter>();
    public List<GrasshopperParameter> Outputs = new List<GrasshopperParameter>();
  }

  public class GrasshopperParameter
  {
    public string NickName { get; set; }
    public string InstanceGuid { get; set; }
    public List<string> Sources { get; set; } = new List<string>();
    public string TypeName { get; set; }
    public List<GrasshopperValue> Values { get; set; }
  }

  public class GrasshopperPosition
  {
    public double X { get; set; }
    public double Y { get; set; }
  }

  public class GrasshopperValue
  {
    public List<int> Path { get; set; } = new List<int>();
    public string Type { get; set; }
    public dynamic Value { get; set; }
  }

  public class GrasshopperResult
  {
    public string Target { get; set; }
    public List<GrasshopperValue> Data { get; set; } = new List<GrasshopperValue>();
  }

  public class ResthopperEndpointsModule : Nancy.NancyModule
  {

    public ResthopperEndpointsModule(Nancy.Routing.IRouteCacheProvider routeCacheProvider)
    {
      Get["/grasshopper"] = _ => TranspileGrasshopperAssemblies(Context);
      Get["/test"] = parameters => GetTestGeometry(Context);
      Post["/grasshopper"] = _ => RunGrasshopper(Context);
      Post["/io"] = _ => GetIoNames(Context);
      Post["/rhino/grasshopper/evaluate"] = _ => EvaluateGrasshopper(Context);
      Post["/grasshopper/graph"] = _ => CreateGrasshopperDefinition(Context);
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

              // var inputInstanceIds = (element.current.inputs as object).GetType().GetProperties().Select(p => p.Name).ToList();
              // var outputInstanceIds = (element.current.outputs as object).GetType().GetProperties().Select(p => p.Name).ToList();

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

              // ghdoc.ExpireSolution();

              var x = Convert.ToSingle(element.current.position[0].ToString());
              var y = Convert.ToSingle(element.current.position[1].ToString());

              ghdoc.Objects.First(item => item.InstanceGuid.ToString() == element.id.ToString()).Attributes.Pivot = new PointF(x, y);
              //parameter.Attributes.Pivot = new PointF(x, y);

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
              break;
            }
        }
      });

      //
      var path = "C:\\Users\\cdrie\\Desktop\\testing\\test.ghx";

      var archive = new GH_Archive();
      archive.Path = path;
      archive.AppendObject(ghdoc, "Definition");
      archive.WriteToFile(path, true, false);

      var bytes = System.Text.Encoding.UTF8.GetBytes(archive.Serialize_Xml());

      var response = (Response)Convert.ToBase64String(bytes);
      response.StatusCode = Nancy.HttpStatusCode.OK;
      response.ContentType = "text/plain";

      return response;
    }

    static Response GetTestGeometry(NancyContext ctx)
    {
      var dims = ctx.Request.Url.ToString().Split('?')[1].Split('&').Select((s) => s.Split('=')[1]).ToArray();
      var x = Double.Parse(dims[0]) / 2;
      var y = Double.Parse(dims[1]) / 2;
      var z = Double.Parse(dims[2]) / 2;
      Console.WriteLine($"{x}, {y}, {z}");
      var box = new Box(Plane.WorldXY, new Interval(-x, x), new Interval(-y, y), new Interval(-z, z));
      var file = new File3dm();
      file.AllLayers.Add(new Rhino.DocObjects.Layer());
      var m = new Rhino.DocObjects.Material();
      m.DiffuseColor = new Color();
      file.AllMaterials.Add(m);
      var sphere = new Sphere(Plane.WorldXY, 1.5);
      var geo = new Box(Plane.WorldXY, new Interval(2, 3), new Interval(2, 3), new Interval(2, 3));
      var b = Mesh.CreateFromBrep(geo.ToBrep(), MeshingParameters.QualityRenderMesh);
      var oa = new Rhino.DocObjects.ObjectAttributes();
      oa.LayerIndex = 0;
      oa.MaterialIndex = 0;
      b.ToList().ForEach(msh => file.Objects.AddMesh(msh, oa));
      var t = DateTime.Now.Ticks.ToString();
      file.Write($"test{t}.3dm", 2);
      var res = System.IO.File.ReadAllBytes($"test{t}.3dm");
      var f = Convert.ToBase64String(res);
      Console.WriteLine(f);

      return JsonConvert.SerializeObject(f);
    }

    static bool IsComponentVariable(IGH_ObjectProxy c)
    {
      try
      {
        var a = Assembly.LoadFrom(c.Location);

        var assemblyType = a.GetTypes().FirstOrDefault(x => c.Type.ToString() == x.FullName);

        if (assemblyType == null)
        {
          return false;
        }

        var res = assemblyType.GetTypeInfo().DeclaredMethods.Select(x => x.Name).ToList().Contains("CanInsertParameter");

        return res;
      }
      catch (Exception e)
      {
        return false;
      }
    }

    static Response TranspileGrasshopperAssemblies(NancyContext ctx)
    {
      var objs = new List<ResthopperComponent>();

      // Convert ReadOnlyCollection of libraries to list for easy searching
      var libraries = new List<GH_AssemblyInfo>();

      var gha = Grasshopper.Instances.ComponentServer.Libraries;
            Console.WriteLine(gha.Count);
      for (int i = 0; i < gha.Count; i++)
      {
        libraries.Add(gha[i]);
      }

      // Convert Object Proxies to Resthopper Components
      var proxies = Grasshopper.Instances.ComponentServer.ObjectProxies;

      for (int i = 0; i < proxies.Count; i++)
      {
        var rc = new ResthopperComponent();
        rc.Guid = proxies[i].Guid.ToString();
        rc.Name = proxies[i].Desc.Name;
        rc.NickName = proxies[i].Desc.NickName;
        rc.Description = proxies[i].Desc.Description;
        rc.Category = proxies[i].Desc.HasCategory ? proxies[i].Desc.Category : "";
        rc.Subcategory = proxies[i].Desc.HasSubCategory ? proxies[i].Desc.SubCategory : "";
        rc.IsObsolete = proxies[i].Obsolete;
        rc.IsVariable = IsComponentVariable(proxies[i]);

        var ms = new MemoryStream();
        proxies[i].Icon.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
        var bytes = ms.ToArray();
        rc.Icon = Convert.ToBase64String(bytes);

        rc.LibraryName = libraries.Find(x => x.Id == proxies[i].LibraryGuid)?.Name ?? "Not found. :(";

        var obj = proxies[i].CreateInstance() as IGH_Component;

        if (obj != null)
        {
          var p = obj.Params;

          //p.Input.Find(y => y.Name == "test").AddSource()

          p.Input.ForEach(x => rc.Inputs.Add(new ResthopperComponentParameter(x)));
          p.Output.ForEach(x => rc.Outputs.Add(new ResthopperComponentParameter(x)));
        }

        objs.Add(rc);
      }

      return JsonConvert.SerializeObject(objs);
    }

    static Response EvaluateGrasshopper(NancyContext ctx)
    {
      // Deserialize request body to document container
      var rhdoc = JsonConvert.DeserializeObject<GrasshopperDocument>(ctx.Request.Body.AsString());

      // Initialize document and cache available objects
      var ghdoc = new GH_Document();
      var proxies = Grasshopper.Instances.ComponentServer.ObjectProxies as List<IGH_ObjectProxy>;
      var allParams = new List<IGH_Param>();
      var targets = new List<IGH_Param>();

      // Loop through all components and instantiate in document with any declared values
      rhdoc.Components.ForEach(c =>
      {
              // Locate proxy for component
              var obj = proxies.FirstOrDefault(x => x.Guid.ToString() == c.Guid);

        if (obj == null)
        {
          return;
        }

              // Instantiate component
              var component = obj.CreateInstance() as IGH_Component;

              // Match parameter properties with declared values
              c.Inputs.ForEach(input =>
              {
            var parameter = component.Params.Input.FirstOrDefault(p => p.NickName == input.NickName);

                  // Match parameter instance guid to declared guid
                  parameter.NewInstanceGuid(new Guid(input.InstanceGuid));

                  // Set any declared values
                  // ( Chuck ) Number only for now
                  for (int i = 0; i < input.Values.Count; i++)
            {
              var v = input.Values[i];
              var path = new GH_Path(v.Path.ToArray());
              var val = new GH_Number(v.Value);
                    // new GH_ObjectWrapper(v.Value).CastTo<GH_Number>(out GH_Number val);
                    parameter.AddVolatileData(path, i, val);
            }

                  // Add parameter to cache, and to target cache if targeted
                  allParams.Add(parameter);
            if (rhdoc.Targets.IndexOf(input.InstanceGuid) >= 0)
            {
              targets.Add(parameter);
            }
          });

        c.Outputs.ForEach(output =>
              {
            var parameter = component.Params.Output.FirstOrDefault(p => p.NickName == output.NickName);

                  // Match parameter instance guid to declared guid
                  parameter.NewInstanceGuid(new Guid(output.InstanceGuid));

                  // Add parameter to cache, and to target cache if targeted
                  allParams.Add(parameter);
            if (rhdoc.Targets.IndexOf(output.InstanceGuid) >= 0)
            {
              targets.Add(parameter);
            }
          });

              // Add component to document
              ghdoc.AddObject(component, false);
      });

      // Loop through all instances and set any sources
      rhdoc.Components.ForEach(c =>
      {
        c.Inputs.ForEach(input =>
              {
            if (input.Sources.Count > 0)
            {
              var parameter = allParams.FirstOrDefault(p => p.InstanceGuid.ToString() == input.InstanceGuid);

              input.Sources.ForEach(s =>
                    {
                    var source = allParams.FirstOrDefault(p => p.InstanceGuid.ToString() == s);
                    parameter.AddSource(source);
                  });
            }
          });
      });

      // Locate and compute result for any targets
      var results = new List<GrasshopperResult>();

      // ghdoc.Enabled = true;
      // ghdoc.NewSolution(false, GH_SolutionMode.CommandLine);

      targets.ForEach(t =>
      {
              //var c = ghdoc.Objects.First(x => ((IGH_Component)x).Params.Output.Select(y => y.InstanceGuid.ToString()).ToList().IndexOf(t.InstanceGuid.ToString()) >= 0);
              t.CollectData();
        t.ComputeData();

        var result = new GrasshopperResult() { Target = t.InstanceGuid.ToString() };

        var volatileData = t.VolatileData;
              //Console.WriteLine(volatileData.AllData(false).ToList().Count);
              for (int p = 0; p < volatileData.PathCount; p++)
        {
          var path = volatileData.Paths[p];
          var goo = volatileData.get_Branch(p);

          for (int i = 0; i < goo.Count; i++)
          {
            var indices = path.Indices.ToList();
            indices.Add(i);
            try
            {
              result.Data.Add(new GrasshopperValue() { Path = indices, Type = goo[i].GetType().Name, Value = ((dynamic)goo[i]).Value });
            }
            catch (Exception e)
            {
              Console.WriteLine(e.Message);
              result.Data.Add(new GrasshopperValue() { Path = indices, Type = "UNSUPPORTED", Value = "" });
            }

          }
        }

        results.Add(result);
      });

      // Return computed results
      return JsonConvert.SerializeObject(results);
    }

    static string GetGhxFromPointer(string pointer)
    {
      string grasshopperXml = string.Empty;

      HttpWebRequest request = (HttpWebRequest)WebRequest.Create(pointer);
      request.AutomaticDecompression = DecompressionMethods.GZip;

      using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
      using (Stream stream = response.GetResponseStream())
      using (StreamReader reader = new StreamReader(stream))
      {
        grasshopperXml = reader.ReadToEnd();
      }

      return StripBom(grasshopperXml);
    }

    static Response RunGrasshopper(NancyContext ctx)
    {
      // load grasshopper file
      GH_Archive archive = null;

      string json = string.Empty;
      using (var reader = new StreamReader(ctx.Request.Body))
      {
        json = reader.ReadToEnd();
      }

      Schema input = JsonConvert.DeserializeObject<Schema>(json);

      if (input.Algo != null)
      {
        byte[] byteArray = Convert.FromBase64String(input.Algo);
        var byteArchive = new GH_Archive();
        try
        {
          if (byteArchive.Deserialize_Binary(byteArray))
            archive = byteArchive;
        }
        catch (Exception) { }

        if (archive == null)
        {
          var grasshopperXml = StripBom(System.Text.Encoding.UTF8.GetString(byteArray));
          var xmlArchive = new GH_Archive();
          if (xmlArchive.Deserialize_Xml(grasshopperXml))
            archive = xmlArchive;
        }
      }
      else
      {
        string pointer = input.Pointer;
        var grasshopperXml = GetGhxFromPointer(pointer);
        var xmlArchive = new GH_Archive();
        if (xmlArchive.Deserialize_Xml(grasshopperXml))
          archive = xmlArchive;
      }

      if (archive == null)
        throw new Exception("Unable to load grasshopper definition");

      using (var definition = new GH_Document())
      {
        if (!archive.ExtractObject(definition, "Definition"))
          throw new Exception();

        // Set input params
        foreach (var obj in definition.Objects)
        {
          var group = obj as GH_Group;
          if (group == null)
            continue;

          if (group.NickName.Contains("RH_IN"))
          {
            // It is a RestHopper input group!
            var param = group.Objects()[0];

            // SetData
            foreach (Resthopper.IO.DataTree<ResthopperObject> tree in input.Values)
            {
              if (group.NickName == tree.ParamName)
              {
                {
                  Param_Boolean boolParam = param as Param_Boolean;
                  if (boolParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Boolean> objectList = new List<GH_Boolean>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        bool boolean = JsonConvert.DeserializeObject<bool>(restobj.Data);
                        GH_Boolean data = new GH_Boolean(boolean);
                        boolParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }


                  Param_Point ptParam = param as Param_Point;
                  if (ptParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Point> objectList = new List<GH_Point>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        Rhino.Geometry.Point3d rPt = JsonConvert.DeserializeObject<Rhino.Geometry.Point3d>(restobj.Data);
                        GH_Point data = new GH_Point(rPt);
                        ptParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }


                  Param_Vector vectorParam = param as Param_Vector;
                  if (vectorParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Vector> objectList = new List<GH_Vector>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        Rhino.Geometry.Vector3d rhVector = JsonConvert.DeserializeObject<Rhino.Geometry.Vector3d>(restobj.Data);
                        GH_Vector data = new GH_Vector(rhVector);
                        vectorParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }


                  Param_Integer integerParam = param as Param_Integer;
                  if (integerParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Integer> objectList = new List<GH_Integer>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        int rhinoInt = JsonConvert.DeserializeObject<int>(restobj.Data);
                        GH_Integer data = new GH_Integer(rhinoInt);
                        integerParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }


                  Param_Number numberParam = param as Param_Number;
                  if (numberParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Number> objectList = new List<GH_Number>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        double rhNumber = JsonConvert.DeserializeObject<double>(restobj.Data);
                        GH_Number data = new GH_Number(rhNumber);
                        numberParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }


                  Param_String stringParam = param as Param_String;
                  if (stringParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_String> objectList = new List<GH_String>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        string rhString = restobj.Data;
                        GH_String data = new GH_String(rhString);
                        stringParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }


                  Param_Line lineParam = param as Param_Line;
                  if (lineParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Line> objectList = new List<GH_Line>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        Rhino.Geometry.Line rhLine = JsonConvert.DeserializeObject<Rhino.Geometry.Line>(restobj.Data);
                        GH_Line data = new GH_Line(rhLine);
                        lineParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }


                  Param_Curve curveParam = param as Param_Curve;
                  if (curveParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Curve> objectList = new List<GH_Curve>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        GH_Curve ghCurve;
                        try
                        {
                          Rhino.Geometry.Polyline data = JsonConvert.DeserializeObject<Rhino.Geometry.Polyline>(restobj.Data);
                          Rhino.Geometry.Curve c = new Rhino.Geometry.PolylineCurve(data);
                          ghCurve = new GH_Curve(c);
                        }
                        catch
                        {
                          Rhino.Geometry.NurbsCurve data = JsonConvert.DeserializeObject<Rhino.Geometry.NurbsCurve>(restobj.Data);
                          Rhino.Geometry.Curve c = new Rhino.Geometry.NurbsCurve(data);
                          ghCurve = new GH_Curve(c);
                        }
                        curveParam.AddVolatileData(path, i, ghCurve);
                      }
                    }
                    continue;
                  }


                  Param_Circle circleParam = param as Param_Circle;
                  if (circleParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Circle> objectList = new List<GH_Circle>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        Rhino.Geometry.Circle rhCircle = JsonConvert.DeserializeObject<Rhino.Geometry.Circle>(restobj.Data);
                        GH_Circle data = new GH_Circle(rhCircle);
                        circleParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }


                  Param_Plane planeParam = param as Param_Plane;
                  if (planeParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Plane> objectList = new List<GH_Plane>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        Rhino.Geometry.Plane rhPlane = JsonConvert.DeserializeObject<Rhino.Geometry.Plane>(restobj.Data);
                        GH_Plane data = new GH_Plane(rhPlane);
                        planeParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }

                  Param_Rectangle rectangleParam = param as Param_Rectangle;
                  if (rectangleParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Rectangle> objectList = new List<GH_Rectangle>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        Rhino.Geometry.Rectangle3d rhRectangle = JsonConvert.DeserializeObject<Rhino.Geometry.Rectangle3d>(restobj.Data);
                        GH_Rectangle data = new GH_Rectangle(rhRectangle);
                        rectangleParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }

                  Param_Box boxParam = param as Param_Box;
                  if (boxParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Box> objectList = new List<GH_Box>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        Rhino.Geometry.Box rhBox = JsonConvert.DeserializeObject<Rhino.Geometry.Box>(restobj.Data);
                        GH_Box data = new GH_Box(rhBox);
                        boxParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }

                  Param_Surface surfaceParam = param as Param_Surface;
                  if (surfaceParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Surface> objectList = new List<GH_Surface>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        Rhino.Geometry.Surface rhSurface = JsonConvert.DeserializeObject<Rhino.Geometry.Surface>(restobj.Data);
                        GH_Surface data = new GH_Surface(rhSurface);
                        surfaceParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }

                  Param_Brep brepParam = param as Param_Brep;
                  if (brepParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Brep> objectList = new List<GH_Brep>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        Rhino.Geometry.Brep rhBrep = JsonConvert.DeserializeObject<Rhino.Geometry.Brep>(restobj.Data);
                        GH_Brep data = new GH_Brep(rhBrep);
                        brepParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }

                  Param_Mesh meshParam = param as Param_Mesh;
                  if (meshParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Mesh> objectList = new List<GH_Mesh>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        Rhino.Geometry.Mesh rhMesh = JsonConvert.DeserializeObject<Rhino.Geometry.Mesh>(restobj.Data);
                        GH_Mesh data = new GH_Mesh(rhMesh);
                        meshParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }

                  GH_NumberSlider sliderParam = param as GH_NumberSlider;
                  if (sliderParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Number> objectList = new List<GH_Number>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        double rhNumber = JsonConvert.DeserializeObject<double>(restobj.Data);
                        GH_Number data = new GH_Number(rhNumber);
                        sliderParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }

                  GH_BooleanToggle toggleParam = param as GH_BooleanToggle;
                  if (toggleParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Boolean> objectList = new List<GH_Boolean>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        bool rhBoolean = JsonConvert.DeserializeObject<bool>(restobj.Data);
                        GH_Boolean data = new GH_Boolean(rhBoolean);
                        toggleParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }

                  GH_Panel panelParam = param as GH_Panel;
                  if (panelParam != null)
                  {
                    foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
                    {
                      GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
                      List<GH_Panel> objectList = new List<GH_Panel>();
                      for (int i = 0; i < entree.Value.Count; i++)
                      {
                        ResthopperObject restobj = entree.Value[i];
                        string rhString = JsonConvert.DeserializeObject<string>(restobj.Data);
                        GH_String data = new GH_String(rhString);
                        panelParam.AddVolatileData(path, i, data);
                      }
                    }
                    continue;
                  }
                }
              }
            }


          }
        }

        Schema OutputSchema = new Schema();
        OutputSchema.Algo = Utils.Base64Encode(string.Empty);

        // Parse output params
        foreach (var obj in definition.Objects)
        {
          var group = obj as GH_Group;
          if (group == null)
            continue;

          if (group.NickName.Contains("RH_OUT"))
          {
            // It is a RestHopper output group!
            var param = group.Objects()[0] as IGH_Param;
            if (param == null)
              continue;

            try
            {
              param.CollectData();
              param.ComputeData();
            }
            catch (Exception)
            {
              param.Phase = GH_SolutionPhase.Failed;
              // TODO: throw something better
              throw;
            }

            // Get data
            Resthopper.IO.DataTree<ResthopperObject> OutputTree = new Resthopper.IO.DataTree<ResthopperObject>();
            OutputTree.ParamName = group.NickName;

            var volatileData = param.VolatileData;
            for (int p = 0; p < volatileData.PathCount; p++)
            {
              List<ResthopperObject> ResthopperObjectList = new List<ResthopperObject>();
              foreach (var goo in volatileData.get_Branch(p))
              {
                if (goo == null)
                  continue;
                else if (goo.GetType() == typeof(GH_Boolean))
                {
                  GH_Boolean ghValue = goo as GH_Boolean;
                  bool rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<bool>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Point))
                {
                  GH_Point ghValue = goo as GH_Point;
                  Point3d rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<Point3d>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Vector))
                {
                  GH_Vector ghValue = goo as GH_Vector;
                  Vector3d rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<Vector3d>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Integer))
                {
                  GH_Integer ghValue = goo as GH_Integer;
                  int rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<int>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Number))
                {
                  GH_Number ghValue = goo as GH_Number;
                  double rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<double>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_String))
                {
                  GH_String ghValue = goo as GH_String;
                  string rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<string>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Line))
                {
                  GH_Line ghValue = goo as GH_Line;
                  Line rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<Line>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Curve))
                {
                  GH_Curve ghValue = goo as GH_Curve;
                  Curve rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<Curve>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Circle))
                {
                  GH_Circle ghValue = goo as GH_Circle;
                  Circle rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<Circle>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Plane))
                {
                  GH_Plane ghValue = goo as GH_Plane;
                  Plane rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<Plane>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Rectangle))
                {
                  GH_Rectangle ghValue = goo as GH_Rectangle;
                  Rectangle3d rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<Rectangle3d>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Box))
                {
                  GH_Box ghValue = goo as GH_Box;
                  Box rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<Box>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Surface))
                {
                  GH_Surface ghValue = goo as GH_Surface;
                  Brep rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<Brep>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Brep))
                {
                  GH_Brep ghValue = goo as GH_Brep;
                  Brep rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<Brep>(rhValue));
                }
                else if (goo.GetType() == typeof(GH_Mesh))
                {
                  GH_Mesh ghValue = goo as GH_Mesh;
                  Mesh rhValue = ghValue.Value;
                  ResthopperObjectList.Add(GetResthopperObject<Mesh>(rhValue));
                }
              }

              GhPath path = new GhPath(new int[] { p });
              OutputTree.Add(path.ToString(), ResthopperObjectList);
            }

            OutputSchema.Values.Add(OutputTree);
          }
        }


        if (OutputSchema.Values.Count < 1)
          throw new System.Exceptions.PayAttentionException("Looks like you've missed something..."); // TODO

        string returnJson = JsonConvert.SerializeObject(OutputSchema, GeometryResolver.Settings);
        return returnJson;
      }
    }

    static Response GetIoNames(NancyContext ctx)
    {
      // load grasshopper file
      var archive = new GH_Archive();
      // TODO: stream to string
      var body = ctx.Request.Body.ToString();
      //
      //var body = input.Algo;

      string json = string.Empty;
      using (var reader = new StreamReader(ctx.Request.Body))
      {
        json = reader.ReadToEnd();

      }

      IoQuerySchema input = JsonConvert.DeserializeObject<IoQuerySchema>(json);
      string pointer = input.RequestedFile;
      string grasshopperXml = GetGhxFromPointer(pointer);

      if (!archive.Deserialize_Xml(grasshopperXml))
        throw new Exception();

      var definition = new GH_Document();
      if (!archive.ExtractObject(definition, "Definition"))
      {
        throw new Exception();
      }

      // Parse input and output names
      List<string> InputNames = new List<string>();
      List<string> OutputNames = new List<string>();
      foreach (var obj in definition.Objects)
      {
        var group = obj as GH_Group;
        if (group == null) continue;

        if (group.NickName.Contains("RH_IN"))
        {
          InputNames.Add(group.NickName);
        }
        else if (group.NickName.Contains("RH_OUT"))
        {
          OutputNames.Add(group.NickName);
        }
      }

      IoResponseSchema response = new IoResponseSchema();
      response.InputNames = InputNames;
      response.OutputNames = OutputNames;

      string jsonResponse = JsonConvert.SerializeObject(response);
      return jsonResponse;
    }

    public static ResthopperObject GetResthopperPoint(GH_Point goo)
    {
      var pt = goo.Value;

      ResthopperObject rhObj = new ResthopperObject();
      rhObj.Type = pt.GetType().FullName;
      rhObj.Data = JsonConvert.SerializeObject(pt, GeometryResolver.Settings);
      return rhObj;

    }
    public static ResthopperObject GetResthopperObject<T>(object goo)
    {
      var v = (T)goo;

      ResthopperObject rhObj = new ResthopperObject();
      rhObj.Type = goo.GetType().FullName;
      rhObj.Data = JsonConvert.SerializeObject(v, GeometryResolver.Settings);
      return rhObj;
    }
    public static void PopulateParam<DataType>(GH_Param<IGH_Goo> Param, Resthopper.IO.DataTree<ResthopperObject> tree)
    {

      foreach (KeyValuePair<string, List<ResthopperObject>> entree in tree)
      {
        GH_Path path = new GH_Path(GhPath.FromString(entree.Key));
        List<DataType> objectList = new List<DataType>();
        for (int i = 0; i < entree.Value.Count; i++)
        {
          ResthopperObject obj = entree.Value[i];
          DataType data = JsonConvert.DeserializeObject<DataType>(obj.Data);
          Param.AddVolatileData(path, i, data);
        }

      }

    }

    // strip bom from string -- [239, 187, 191] in byte array == (char)65279
    // https://stackoverflow.com/a/54894929/1902446
    static string StripBom(string str)
    {
      if (!string.IsNullOrEmpty(str) && str[0] == (char)65279)
        str = str.Substring(1);

      return str;
    }
  }
}

namespace System.Exceptions
{
  public class PayAttentionException : Exception
  {
    public PayAttentionException(string m) : base(m)
    {

    }

  }
}
