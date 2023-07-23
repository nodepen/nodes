using Speckle.Core.Models;
using Speckle.Newtonsoft.Json;

namespace NodePen.Converters
{

    /// <summary>
    /// Solution data for a given port on a given node in a given document's solution.
    /// </summary>
    public class NodePenPortSolutionData : Base
    {

        /// <summary>
        /// The instance id of the associated port in a given document.
        /// </summary>
        [JsonProperty("portInstanceId")]
        public string PortInstanceId { get; set; }

        /// <summary>
        /// Solution values associated with this port for this solution.
        /// </summary>
        [JsonProperty("dataTree")]
        public NodePenDataTree DataTree { get; set; } = new NodePenDataTree();

        public NodePenPortSolutionData(string portInstanceId)
        {
            PortInstanceId = portInstanceId;
        }

    }

}