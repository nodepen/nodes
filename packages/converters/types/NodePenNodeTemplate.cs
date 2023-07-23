using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using Speckle.Newtonsoft.Json;
using Grasshopper.Kernel;

namespace NodePen.Converters
{

    [JsonObject(MemberSerialization.OptOut)]
    public struct NodePenNodeTemplate
    {

        [JsonProperty("guid")]
        public string Guid { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("nickName")]
        public string NickName { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("keywords")]
        public List<string> Keywords { get; set; }

        [JsonProperty("icon")]
        public string Icon { get; set; }

        [JsonProperty("libraryName")]
        public string LibraryName { get; set; }

        [JsonProperty("category")]
        public string Category { get; set; }

        [JsonProperty("subcategory")]
        public string Subcategory { get; set; }

        [JsonProperty("isObsolete")]
        public bool IsObsolete { get; set; }

        [JsonProperty("inputs")]
        public List<NodePenPortTemplate> Inputs { get; set; }

        [JsonProperty("outputs")]
        public List<NodePenPortTemplate> Outputs { get; set; }

        public void SetIcon(Bitmap icon)
        {
            var stream = new MemoryStream();
            icon.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
            var bytes = stream.ToArray();
            Icon = Convert.ToBase64String(bytes);
        }

        public void AddParameter(IGH_Param parameter, string direction)
        {
            var currentParameterCount = direction == "input" ? Inputs.Count : Outputs.Count;

            var template = new NodePenPortTemplate()
            {
                Name = parameter.Name,
                NickName = parameter.NickName,
                Description = parameter.Description,
                TypeName = parameter.TypeName.ToLower(),
                IsOptional = parameter.Optional,
                Keywords = new List<string>(),
            };

            if (parameter.Keywords != null && parameter.Keywords.Count() > 0)
            {
                template.Keywords = parameter.Keywords.ToList();
            }

            template.SetDirection(direction);
            template.SetOrder(currentParameterCount);

            switch (direction)
            {
                case "input":
                    {
                        Inputs.Add(template);
                        break;
                    }
                case "output":
                    {
                        Outputs.Add(template);
                        break;
                    }
                default:
                    {
                        Console.WriteLine($"Unhandled port direction: [{direction}]");
                        break;
                    }
            }

        }

    }

}