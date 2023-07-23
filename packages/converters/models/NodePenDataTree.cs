using Speckle.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Speckle.Newtonsoft.Json;

namespace NodePen.Converters
{

    /// <summary>
    /// A collection of values of assorted types and structures.
    /// </summary>
    /// <remarks>
    /// Modeled after Grasshopper's data tree structure. (ily David Rutten)
    /// </remarks>
    public class NodePenDataTree : Base
    {

        /// <summary>
        /// A collection of branches of values for this data tree.
        /// </summary>
        [DetachProperty]
        [JsonProperty("branches")]
        public List<NodePenDataTreeBranch> Branches { get; set; } = new List<NodePenDataTreeBranch>();

        /// <summary>
        /// Assorted metadata about this data tree's structure and values.
        /// </summary>
        [JsonProperty("stats")]
        public NodePenDataTreeStats Stats { get; set; } = new NodePenDataTreeStats();

        public NodePenDataTree()
        {

        }

        /// <summary>
        /// Update data tree stats to reflect the current collection of values.
        /// </summary>
        public void ComputeStats()
        {
            Stats = new NodePenDataTreeStats();

            ComputeStructure();
            ComputeTotalCounts();
            ComputeTypes();
        }

        private void ComputeStructure()
        {
            if (Branches == null || Branches.Count == 0)
            {
                Stats.TreeStructure = "empty";
                return;
            }

            if (Branches.Count == 1)
            {
                var branch = Branches[0];

                if (branch.Values.Count == 1)
                {
                    Stats.TreeStructure = "single";
                    return;
                }

                if (branch.Values.Count > 1)
                {
                    Stats.TreeStructure = "list";
                    return;
                }
            }

            Stats.TreeStructure = "tree";
        }

        private void ComputeTotalCounts()
        {
            var valueCounts = new List<int>();

            foreach (var branch in Branches)
            {
                valueCounts.Add(branch.Values.Count);
            }

            if (valueCounts.Count == 0)
            {
                Stats.BranchCount = Branches.Count;
                Stats.ValueCount = 0;
                return;
            }

            Stats.BranchCount = Branches.Count;
            Stats.BranchValueCountDomain = new List<int>{
              valueCounts.Min(),
              valueCounts.Max()
            };
            Stats.ValueCount = valueCounts.Sum();
        }

        private void ComputeTypes()
        {
            var types = new HashSet<string>();

            foreach (var branch in Branches)
            {
                foreach (var value in branch.Values)
                {
                    types.Add(value.Type.ToLower());
                }
            }

            Stats.ValueTypes = types.ToList();
        }

    }

    /// <summary>
    /// Assorted metadata about a given data tree's structure and values.
    /// </summary>
    public class NodePenDataTreeStats : Base
    {

        /// <summary>
        /// The number of branches in this data tree.
        /// </summary>
        [JsonProperty("branchCount")]
        public int BranchCount { get; set; } = 0;

        /// <summary>
        /// The minimum and maximum number of values found in branches in this data tree.
        /// </summary>
        [JsonProperty("branchValueCountDomain")]
        public List<int> BranchValueCountDomain { get; set; } = new List<int> { 0, 0 };

        /// <summary>
        /// A summary of the shape and number of branches in this data tree.
        /// </summary>
        /// <remarks>
        /// Valid values: "empty" | "single" | "list" | "tree"
        /// </remarks>
        [JsonProperty("treeStructure")]
        public string TreeStructure { get; set; } = "empty";

        /// <summary>
        /// The total number of values found within all branches in this data tree.
        /// </summary>
        [JsonProperty("valueCount")]
        public int ValueCount { get; set; } = 0;

        /// <summary>
        /// The set of value types found within all branches in this data tree.
        /// </summary>
        [JsonProperty("valueTypes")]
        public List<string> ValueTypes { get; set; } = new List<string>();

        public NodePenDataTreeStats()
        {

        }

    }

    /// <summary>
    /// A specific list of values found within a given data tree.
    /// </summary>
    public class NodePenDataTreeBranch : Base
    {

        /// <summary>
        /// The position of this branch in the list of all branches in this data tree.
        /// </summary>
        [JsonProperty("order")]
        public int Order { get; set; }

        /// <summary>
        /// The unique identifier for this branch in this data tree.
        /// </summary>
        /// <remarks>
        /// Follows the pattern: {N;N}
        /// </remarks>
        [JsonProperty("path")]
        public string Path { get; set; }

        /// <summary>
        /// The collection of values associated with this branch.
        /// </summary>
        [DetachProperty]
        [JsonProperty("values")]
        public List<NodePenDataTreeValue> Values { get; set; } = new List<NodePenDataTreeValue>();

        public NodePenDataTreeBranch()
        {

        }

    }

    /// <summary>
    /// A single value in a given branch in a given data tree.
    /// </summary>
    public class NodePenDataTreeValue : Base
    {

        /// <summary>
        /// The position of this value in the list of all values in this branch.
        /// </summary>
        [JsonProperty("order")]
        public int Order { get; set; }

        /// <summary>
        /// A string identifier for the native or shared type this value represents.
        /// </summary>
        [JsonProperty("type")]
        public string Type { get; set; }

        /// <summary>
        /// A brief string-based description of what this value represents. i.e. "Trimmed Curve"
        /// </summary>
        [JsonProperty("description")]
        public string Description { get; set; }

        /// <summary>
        /// A JSON-serializable representation of the value.
        /// </summary>
        [JsonProperty("value")]
        public string Value { get; set; } = null;

        /// <summary>
        /// An object that represents the geometric properties of the value.
        /// </summary>
        /// <remarks>
        /// Currently, in all cases, this is the Speckle representation of the value's native geometry.
        /// </remarks>
        [JsonProperty("geometry")]
        public Base Geometry { get; set; } = null;

        public NodePenDataTreeValue()
        {

        }

        public double UnwrapAsDouble()
        {
            return Convert.ToDouble(Value);
        }

        public int UnwrapAsInteger()
        {
            return Convert.ToInt32(Value);
        }

    }

}