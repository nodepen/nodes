using System;
using System.Linq;
using System.Collections.Generic;
using Grasshopper.Kernel;
using GH_IO.Serialization;
using Speckle.Newtonsoft.Json;
using Speckle.Newtonsoft.Json.Converters;

namespace NodePen.Converters
{

    public static class NodePenConvert
    {
        public static List<NodePenNodeTemplate> Templates = new List<NodePenNodeTemplate>();

        /// <summary>
        /// Detect and initialize all components installed on the current Grasshopper instance.
        /// </summary>
        public static void Configure()
        {
            Templates.Clear();

            var templates = new List<NodePenNodeTemplate>();

            var libraryDefinitions = Grasshopper.Instances.ComponentServer.Libraries.ToList();
            var objectDefinitions = Grasshopper.Instances.ComponentServer.ObjectProxies;

            foreach (var definition in objectDefinitions)
            {
                var instance = definition.CreateInstance();

                switch (instance)
                {
                    case IGH_Component component:
                        {
                            var template = new NodePenNodeTemplate()
                            {
                                Guid = component.ComponentGuid.ToString(),
                                Name = component.Name,
                                NickName = component.NickName,
                                Description = component.Description,
                                Category = component.Category,
                                Subcategory = component.SubCategory,
                                IsObsolete = component.Obsolete,
                                Keywords = new List<string>(),
                                Inputs = new List<NodePenPortTemplate>(),
                                Outputs = new List<NodePenPortTemplate>()
                            };

                            template.SetIcon(component.Icon_24x24);
                            template.LibraryName = libraryDefinitions.FirstOrDefault((library) => library.Id == definition.LibraryGuid)?.Name ?? "";

                            if (component.Keywords != null && component.Keywords.Count() > 0)
                            {
                                template.Keywords = component.Keywords.ToList();
                            }

                            foreach (var input in component.Params.Input)
                            {
                                template.AddParameter(input, "input");
                            }

                            foreach (var output in component.Params.Output)
                            {
                                template.AddParameter(output, "output");
                            }

                            // Console.WriteLine($"Loaded [{template.Name}] from [{template.LibraryName}]");

                            Templates.Add(template);

                            break;
                        }
                    case IGH_Param parameter:
                        {
                            var template = new NodePenNodeTemplate()
                            {
                                Guid = parameter.ComponentGuid.ToString(),
                                Name = parameter.Name,
                                NickName = parameter.NickName,
                                Description = parameter.Description,
                                Category = parameter.Category,
                                Subcategory = parameter.SubCategory,
                                IsObsolete = parameter.Obsolete,
                                Keywords = new List<string>(),
                                Inputs = new List<NodePenPortTemplate>(),
                                Outputs = new List<NodePenPortTemplate>()
                            };

                            template.SetIcon(parameter.Icon_24x24);
                            template.LibraryName = libraryDefinitions.FirstOrDefault((library) => library.Id == definition.LibraryGuid)?.Name ?? "";

                            Templates.Add(template);

                            break;
                        }
                    default:
                        {
                            Console.WriteLine($"Failed to load [{instance.GetType()}]");
                            break;
                        }
                }
            }

            Console.WriteLine($"Configured NodePenConvert with {Templates.Count()} locally installed components.");
        }

        public static void ConfigureWith(List<NodePenNodeTemplate> templates)
        {
            Templates.Clear();
            Templates.AddRange(templates);

            // TODO: Confirm provided templates exist in current session.

            Console.WriteLine($"Configured NodePenConvert with {Templates.Count()} of {templates.Count()} provided templates.");
        }

        public static NodePenDocument Serialize(byte[] data)
        {
            var archive = new GH_Archive();

            var document = archive.Deserialize_Binary(data)
                ? Serialize(archive)
                : throw new Exception("Failed to parse provided binary data as Grasshopper document.");

            return document;
        }

        public static NodePenDocument Serialize(GH_Archive archive)
        {
            var definition = new GH_Document();

            if (!archive.ExtractObject(definition, "Definition"))
            {
                throw new Exception("Failed to extract definition from Grasshopper archive.");
            }

            return Serialize(definition);
        }

        public static NodePenDocument Serialize(GH_Document ghdoc)
        {
            NodePenDocument document = new NodePenDocument();

            foreach (IGH_DocumentObject documentObject in ghdoc.Objects)
            {
                switch (documentObject)
                {
                    case IGH_Component component:
                        {
                            var template = Templates.FirstOrDefault((t) => t.Guid == component.ComponentGuid.ToString());

                            if (template.Guid == null)
                            {
                                Console.WriteLine($"Could not find template for document object {component.Name}");
                                continue;
                            }

                            var node = new NodePenDocumentNode()
                            {
                                InstanceId = component.InstanceGuid.ToString(),
                                TemplateId = template.Guid.ToString(),
                            };

                            node.Position.X = component.Attributes.Pivot.X * 2;
                            node.Position.Y = component.Attributes.Pivot.Y * -2;

                            for (var i = 0; i < component.Params.Input.Count; i++)
                            {
                                var currentParam = component.Params.Input[i];
                                var currentParamId = currentParam.InstanceGuid.ToString();

                                node.Inputs.Add(currentParamId, i);

                                // TODO: Populate sources
                                node.Sources.Add(currentParamId, new List<NodePenPortReference>());

                                // TODO: Populate persisted data
                                node.Values.Add(currentParamId, new NodePenDataTree());
                            }

                            for (var i = 0; i < component.Params.Output.Count; i++)
                            {
                                var currentParam = component.Params.Output[i];
                                var currentParamId = currentParam.InstanceGuid.ToString();

                                node.Outputs.Add(currentParamId, i);
                            }

                            document.Nodes.Add(node.InstanceId, node);

                            break;
                        }
                    case IGH_Param parameter:
                        {
                            break;
                        }
                    default:
                        {
                            Console.WriteLine($"Could not serialize document object [{documentObject.GetType()}]");
                            break;
                        }
                }
            }

            return document;
        }

        public static T Deserialize<T>(NodePenDocument document) where T : GH_Archive, new()
        {
            T archive = new T();

            return archive;

        }

    }

}