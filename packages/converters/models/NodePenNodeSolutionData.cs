using Speckle.Core.Models;
using Speckle.Newtonsoft.Json;
using System.Collections.Generic;

namespace NodePen.Converters
{

    /// <summary>
    /// Solution data for a given node in a given document's solution.
    /// </summary>
    public class NodePenNodeSolutionData : Base
    {

        /// <summary>
        /// The instance id of the associated node in a given document.
        /// </summary>
        [JsonProperty("nodeInstanceId")]
        public string NodeInstanceId { get; set; }

        /// <summary>
        /// Metrics and other metadata about this node's execution during this solution.
        /// </summary>
        [JsonProperty("nodeRuntimeData")]
        public NodePenNodeRuntimeData NodeRuntimeData { get; set; } = new NodePenNodeRuntimeData();

        /// <summary>
        /// A collection of solution data for this node's child ports.
        /// </summary>
        [DetachProperty]
        [JsonProperty("portSolutionData")]
        public List<NodePenPortSolutionData> PortSolutionData { get; set; } = new List<NodePenPortSolutionData>();

        public NodePenNodeSolutionData(string nodeInstanceId)
        {
            NodeInstanceId = nodeInstanceId;
        }

    }

    /// <summary>
    /// Metrics and other metadata about a given node's execution during a given solution.
    /// </summary>
    public class NodePenNodeRuntimeData : Base
    {

        /// <summary>
        /// The number of milliseconds this node took to execute during a given solution.
        /// </summary>
        [JsonProperty("durationMs")]
        public double DurationMs { get; set; } = 0;

        /// <summary>
        /// A collection of messages that may have been raised during this node's execution.
        /// </summary>
        [JsonProperty("messages")]
        public List<NodePenNodeRuntimeDataMessage> Messages { get; set; } = new List<NodePenNodeRuntimeDataMessage>();

        public NodePenNodeRuntimeData()
        {

        }

    }

    /// <summary>
    /// A message raised during a given node's execution.
    /// </summary>
    public class NodePenNodeRuntimeDataMessage : Base
    {

        /// <summary>
        /// The severity of the message raised.
        /// </summary>
        /// <remarks>
        /// Valid values: "error" | "warning" | "info"
        /// </remarks>
        public string Level { get; set; }

        /// <summary>
        /// The message raised.
        /// </summary>
        public string Message { get; set; }

        public NodePenNodeRuntimeDataMessage()
        {

        }

    }

}