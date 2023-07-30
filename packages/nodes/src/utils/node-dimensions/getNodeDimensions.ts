import type * as NodePen from '@nodepen/core'
import { DIMENSIONS } from '@/constants'
import { clamp } from '@/utils/numerics'
import { getLabelWidth } from './getLabelWidth'

// Steps:
// Collect node information (templates and port configurations)
// Compute dimensions here
// Set anchors and other dimensions
// When rendering, *use those values* *reactively*, do not compute anything in components
// ...
// On a change that modifies dimensions, run this and update values in state.

// labels: 12px per character, 22px per flag badge

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

  const inputLabelWidths: Record<string, number> = {}

  for (const [instanceId, orderIndex] of Object.entries(node.inputs)) {
    const portTemplate = nodeTemplate.inputs[orderIndex]
    const portConfiguration = node.portConfigurations[instanceId]

    const labelWidth = getLabelWidth(portTemplate, portConfiguration)

    inputLabelWidths[instanceId] = labelWidth
  }

  const inputLabelColumnWidth = Math.max(...Object.values(inputLabelWidths), DIMENSIONS.NODE_PORT_MINIMUM_WIDTH)

  const outputLabelWidths: Record<string, number> = {}

  for (const [instanceId, orderIndex] of Object.entries(node.outputs)) {
    const portTemplate = nodeTemplate.outputs[orderIndex]
    const portConfiguration = node.portConfigurations[instanceId]

    const labelWidth = getLabelWidth(portTemplate, portConfiguration)

    outputLabelWidths[instanceId] = labelWidth
  }

  const outputLabelColumnWidth = Math.max(...Object.values(outputLabelWidths), DIMENSIONS.NODE_PORT_MINIMUM_WIDTH)

  // Calculate overall width
  const nodeWidth = [
    DIMENSIONS.NODE_INTERNAL_PADDING,
    inputLabelColumnWidth,
    DIMENSIONS.NODE_INTERNAL_PADDING,
    DIMENSIONS.NODE_LABEL_WIDTH,
    DIMENSIONS.NODE_INTERNAL_PADDING,
    outputLabelColumnWidth,
    DIMENSIONS.NODE_INTERNAL_PADDING,
  ].reduce((sum, n) => sum + n, 0)

  // Calculate overall height
  const inputPortsHeight = nodeTemplate.inputs.length * DIMENSIONS.NODE_PORT_HEIGHT
  const outputPortsHeight = nodeTemplate.inputs.length * DIMENSIONS.NODE_PORT_HEIGHT
  const minimumLabelHeight = nodeTemplate.nickName.length * 12 // not monospace, estimate

  const nodeHeight = Math.max(inputPortsHeight, outputPortsHeight, minimumLabelHeight)

  // Calculate port anchors (center based on height)

  // Calculate label axis anchor

  return nodeDimensions
}
