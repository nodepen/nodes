import type * as NodePen from '@nodepen/core'
import { DIMENSIONS } from '@/constants'

// Steps:
// Collect node information (templates and port configurations)
// Compute dimensions here
// Set anchors and other dimensions
// When rendering, *use those values* *reactively*, do not compute anything in components
// ...
// On a change that modifies dimensions, run this and update values in state.

export const getNodeDimensions = (
  node: NodePen.DocumentNode,
  nodeTemplate: NodePen.NodeTemplate
): Pick<NodePen.DocumentNode, 'anchors' | 'dimensions'> => {
  const nodeDimensions: Pick<NodePen.DocumentNode, 'anchors' | 'dimensions'> = {
    anchors: {},
    dimensions: {
      width: 0,
      height: 0,
    },
  }

  // Calculate overall width
  const nodeWidth = [
    DIMENSIONS.NODE_INTERNAL_PADDING, // Input port dot column
    0, // Input labels column (portConfiguration.label ?? portTemplate.nickname)
    0, // Input flags column
    0, // Extra padding between inputs and label,
    0, // Label
    0, // Extra padding between outputs and label,
    0, // Output flags column
    0, // Output labels column
    0, // Output port dot column
  ]

  // Calculate overall height

  // Calculate port anchors

  // Calculate label axis anchor

  return nodeDimensions
}
