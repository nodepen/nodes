using Speckle.Core.Models;
using System.Collections.Generic;

namespace NodePen.Converters
{

    public class NodePenDataTree : Base
    {

        public List<NodePenDataTreeBranch> Branches { get; set; } = new List<NodePenDataTreeBranch>();

        public string Description { get; set; }

        public NodePenDataTreeStats Stats { get; set; }

        // "empty" | "single" | "list" | "tree"
        public string Structure { get; set; }

    }

    public class NodePenDataTreeStats : Base
    {

        public int BranchCount { get; set; }

        public List<string> Types { get; set; } = new List<string>();

        public int ValueCount { get; set; }

    }

    public class NodePenDataTreeBranch : Base
    {

        public int Order { get; set; }

        public string Path { get; set; }

        public List<NodePenDataTreeValue> Values { get; set; } = new List<NodePenDataTreeValue>();

    }

    public class NodePenDataTreeValue : Base
    {

        // "integer" "curve" etc
        public string Type { get; set; }

        // "Trimmed Curve"
        public string Description { get; set; }

        public dynamic NativeValue { get; set; } = null;

        public dynamic NativeGeometry { get; set; } = null;

        public dynamic SpeckleGeometry { get; set; } = null;

    }

}

// export type DataTree = {
//   branches: DataTreeBranch[]
//   description: string // "1 list of 2 strings"
//   stats: DataTreeStats
//   structure: DataTreeStructure
// }

// export type DataTreeBranch = {
//   order: number
//   path: DataTreePath
//   values: DataTreeValue[]
// }

// export type DataTreeValue = Readonly<{
//   type: DataTreeValueType
//   description: string
//   value?: unknown // Rhino JSON?
//   geometry?: unknown // Speckle
// }>