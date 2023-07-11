using Speckle.Core.Models;
using System.Collections.Generic;

namespace NodePen.Converters
{

    public class NodePenDocumentSolutionData : Base
    {

        public string SolutionId { get; set; }

        public NodePenDocumentSolutionManifest SolutionManifest { get; set; }

        [DetachProperty]
        public List<NodePenPortSolutionData> PortSolutionData { get; set; } = new List<NodePenPortSolutionData>();

    }

    public class NodePenDocumentSolutionManifest : Base
    {

        public int RuntimeDurationMs { get; set; }

        public Dictionary<string, string> RuntimeMessages { get; set; } = new Dictionary<string, string>();

    }

    public class NodePenPortSolutionData : Base
    {

        public string NodeInstanceId { get; set; }

        public string PortInstanceId { get; set; }

        public NodePenDataTree DataTree { get; set; } = new NodePenDataTree();

    }
}