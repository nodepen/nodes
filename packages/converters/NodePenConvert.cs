using System;
using System.Linq;
using System.Collections.Generic;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Data;
using Grasshopper.Kernel.Types;
using Grasshopper.Kernel.Parameters;
using GH_IO.Serialization;
using Speckle.Newtonsoft.Json;
using Speckle.Newtonsoft.Json.Converters;

namespace NodePen.Converters
{

    public static class NodePenConvert
    {
        public static List<NodePenNodeTemplate> Templates = new List<NodePenNodeTemplate>();

        public static string TruncateId(string id)
        {
            return id.Split('-')[0];
        }

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

                            Console.WriteLine($"Converting component {component.InstanceGuid}");

                            var node = new NodePenDocumentNode()
                            {
                                InstanceId = component.InstanceGuid.ToString(),
                                TemplateId = template.Guid.ToString(),
                            };

                            node.Position.X = component.Attributes.Pivot.X * 2;
                            node.Position.Y = component.Attributes.Pivot.Y * 2;

                            for (var i = 0; i < component.Params.Input.Count; i++)
                            {
                                var currentParam = component.Params.Input[i];
                                var currentParamId = currentParam.InstanceGuid.ToString();

                                node.Inputs.Add(currentParamId, i);

                                // Populate sources
                                var sources = new List<NodePenPortReference>();

                                for (var j = 0; j < currentParam.SourceCount; j++)
                                {
                                    var currentSource = currentParam.Sources[j];

                                    var sourceNodeInstanceId = currentSource.Attributes.Parent.DocObject.InstanceGuid.ToString();
                                    var sourcePortInstanceId = currentSource.InstanceGuid.ToString();

                                    sources.Add(new NodePenPortReference()
                                    {
                                        NodeInstanceId = sourceNodeInstanceId,
                                        PortInstanceId = sourcePortInstanceId
                                    });
                                }

                                node.Sources.Add(currentParamId, sources);

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

            var definition = new GH_Document();
            definition.Enabled = true;

            var proxies = Grasshopper.Instances.ComponentServer.ObjectProxies;

            var documentObjectMap = new Dictionary<string, IGH_DocumentObject>();

            // First pass: instantiate all nodes with user-set values
            // TODO: Some sort of topological sort so we can know sources are available and avoid a second loop
            foreach (var node in document.Nodes.Values)
            {
                var nodeTemplateProxy = proxies.FirstOrDefault((proxy) => proxy.Guid.ToString() == node.TemplateId);

                if (nodeTemplateProxy == null)
                {
                    Console.WriteLine($"Could not find object proxy for node {node.InstanceId}");
                    continue;
                }

                var nodeInstance = nodeTemplateProxy.CreateInstance();

                // Apply properties from document node to component instance
                nodeInstance.NewInstanceGuid(new Guid(node.InstanceId));
                nodeInstance.Attributes.Pivot = new System.Drawing.PointF((float)node.Position.X, (float)node.Position.Y);

                switch (nodeInstance)
                {
                    case IGH_Component componentInstance:
                        {
                            foreach (var inputInstanceId in node.Inputs.Keys)
                            {
                                // Associate Grasshopper document input param with NodePen document port
                                var i = node.Inputs[inputInstanceId];
                                var param = componentInstance.Params.Input[i];
                                param.NewInstanceGuid(new Guid(inputInstanceId));

                                // Get user-declared values from NodePen document
                                var values = node.Values[inputInstanceId];

                                if (values == null)
                                {
                                    Console.WriteLine($"🐍 Node [{node.InstanceId}] is missing values for input port [{inputInstanceId}]");
                                }

                                if (values.Branches.Count == 0)
                                {
                                    // Node has no values to assign.
                                    continue;
                                }

                                // TODO: Handle more than single values
                                var firstPortBranch = values.Branches.FirstOrDefault();
                                var value = firstPortBranch.Values.FirstOrDefault();

                                if (value == null)
                                {
                                    // Branch has no values
                                    continue;
                                }

                                // Set user-declared values as param persistent data
                                if (Grasshopper.Utility.InvokeGetterSafe(param, "PersistentData") is IGH_Structure persistentData)
                                {
                                    persistentData.ClearData();

                                    switch (param)
                                    {
                                        case Param_Number numberParam:
                                            {
                                                var valueGoo = new GH_Number(value.UnwrapAsDouble());

                                                var tree = new GH_Structure<GH_Number>();
                                                var pathIndices = new List<int>() { 0 }.ToArray();
                                                var branch = new GH_Path(pathIndices);
                                                tree.Insert(valueGoo, branch, 0);

                                                numberParam.SetPersistentData(tree, branch, valueGoo);
                                                break;
                                            }
                                        case Param_Integer integerParam:
                                            {
                                                var valueGoo = new GH_Integer(value.UnwrapAsInteger());

                                                var tree = new GH_Structure<GH_Integer>();
                                                var pathIndices = new List<int>() { 0 }.ToArray();
                                                var branch = new GH_Path(pathIndices);
                                                tree.Insert(valueGoo, branch, 0);

                                                integerParam.SetPersistentData(tree, branch, valueGoo);
                                                break;
                                            }
                                        default:
                                            {
                                                Console.WriteLine($"Unhandled user-input param [{param.GetType()}]");
                                                break;
                                            }
                                    }

                                    param.OnObjectChanged(GH_ObjectEventType.PersistentData);
                                }
                                else
                                {
                                    Console.WriteLine($"🐍 Failed to set persistent data on port [{inputInstanceId}]");
                                }
                            }

                            foreach (var outputInstanceId in node.Outputs.Keys)
                            {
                                // Associate output param with document port
                                var i = node.Outputs[outputInstanceId];
                                var param = componentInstance.Params.Output[i];
                                param.NewInstanceGuid(new Guid(outputInstanceId));
                            }

                            break;
                        }
                    default:
                        {
                            break;
                        }
                }

                documentObjectMap.Add(node.InstanceId, nodeInstance);
                if (!definition.AddObject(nodeInstance, false))
                {
                    Console.WriteLine($"Failed to write node [{node.InstanceId}] to Grasshopper document!");
                }
            }

            // Second pass: attach sources
            foreach (var node in document.Nodes.Values)
            {
                var nodeInstance = documentObjectMap[node.InstanceId];

                if (nodeInstance == null)
                {
                    Console.WriteLine($"Could not document object with guid {node.InstanceId}");
                    continue;
                }

                switch (nodeInstance)
                {
                    case IGH_Component componentInstance:
                        {
                            foreach (var inputInstanceId in node.Inputs.Keys)
                            {
                                var inputParam = componentInstance.Params.Input.FirstOrDefault((param) => param.InstanceGuid.ToString() == inputInstanceId);
                                var sources = node.Sources[inputInstanceId];

                                foreach (var source in sources)
                                {
                                    var sourceInstance = documentObjectMap[source.NodeInstanceId];

                                    if (sourceInstance == null)
                                    {
                                        Console.WriteLine($"Could not assign source!");
                                        continue;
                                    }

                                    switch (sourceInstance)
                                    {
                                        case IGH_Component sourceComponent:
                                            {
                                                var sourceParameter = sourceComponent.Params.Output.FirstOrDefault((param) => param.InstanceGuid.ToString() == source.PortInstanceId);
                                                inputParam.Sources.Add(sourceParameter);
                                                break;
                                            }
                                        default:
                                            {
                                                break;
                                            }
                                    }
                                }
                            }

                            break;
                        }
                    default:
                        {
                            Console.WriteLine($"Could not deserialize unhandled document object type {nodeInstance.GetType()}");
                            break;
                        }
                }
            }

            if (!archive.AppendObject(definition, "definition"))
            {
                throw new Exception("Failed to create empty definition.");
            };

            return archive;

        }

    }

}