using Speckle.Core.Models;
using Speckle.Newtonsoft.Json;
using System.Collections.Generic;

namespace NodePen.Converters
{

    /// <summary>
    /// Solution data for a given document.
    /// </summary>
    public class NodePenDocumentSolutionData : Base
    {

        /// <summary>
        /// The unique id for a given document's solution.
        /// </summary>
        [JsonProperty("solutionId")]
        public string SolutionId { get; set; }

        /// <summary>
        /// Metrics and other metadata about a given document's execution during this solution.
        /// </summary>
        [JsonProperty("documentRuntimeData")]
        public NodePenDocumentRuntimeData DocumentRuntimeData { get; set; } = new NodePenDocumentRuntimeData();

        /// <summary>
        /// A collection of solution data for a given document's child nodes.
        /// </summary>
        [JsonProperty("nodeSolutionData")]
        public List<NodePenNodeSolutionData> NodeSolutionData { get; set; } = new List<NodePenNodeSolutionData>();

        public NodePenDocumentSolutionData(string solutionId)
        {
            SolutionId = solutionId;
        }

    }

    /// <summary>
    /// Metrics and other metadata about a given document's execution during a given solution.
    /// </summary>
    public class NodePenDocumentRuntimeData : Base
    {
        /// <summary>
        /// The number of milliseconds the document took to execute during a given solution.
        /// </summary>
        [JsonProperty("durationMs")]
        public double DurationMs { get; set; } = 0;

        public NodePenDocumentRuntimeData()
        {

        }

    }

}