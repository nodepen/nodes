using Speckle.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace NodePen.Converters
{

    public class NodePenDataTree : Base
    {

        [DetachProperty]
        public List<NodePenDataTreeBranch> Branches { get; set; } = new List<NodePenDataTreeBranch>();

        public NodePenDataTreeStats Stats { get; set; }

        // "empty" | "single" | "list" | "tree"
        public string Structure { get; set; }

        // TODO
        public void ComputeStats()
        {
            return;
        }

        public void ComputeStructure()
        {
            if (Branches == null || Branches.Count == 0)
            {
                Structure = "empty";
                return;
            }

            if (Branches.Count == 1)
            {
                var branch = Branches[0];

                if (branch.Values.Count == 1)
                {
                    Structure = "single";
                    return;
                }

                if (branch.Values.Count > 1)
                {
                    Structure = "list";
                    return;
                }
            }

            Structure = "tree";
        }

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

        [DetachProperty]
        public List<NodePenDataTreeValue> Values { get; set; } = new List<NodePenDataTreeValue>();

    }

    public class NodePenDataTreeValue : Base
    {

        // "integer" "curve" etc
        public string Type { get; set; }

        // "Trimmed Curve"
        public string Description { get; set; }

        public string NativeValue { get; set; } = null;

        public dynamic NativeGeometry { get; set; } = null;

        public dynamic SpeckleGeometry { get; set; } = null;

        public double UnwrapAsDouble()
        {
            return Convert.ToDouble(NativeValue);
        }

        public int UnwrapAsInteger()
        {
            return Convert.ToInt32(NativeValue);
        }

    }

}