import type * as NodePen from '@nodepen/core'
import { DIMENSIONS } from '@/constants'
import { getLabelWidth } from './getLabelWidth'

type NodeWidthDimensions = {
  totalWidth: number
  anchors: {
    labelDeltaX: number
  }
}

export const getNodeWidth = (node: NodePen.DocumentNode, nodeTemplate: NodePen.NodeTemplate): NodeWidthDimensions => {
  const inputs = Object.entries(node.inputs)
  const inputLabelWidths: Record<string, number> = {}

  for (const [instanceId, orderIndex] of inputs) {
    const portTemplate = nodeTemplate.inputs[orderIndex]
    const portConfiguration = node.portConfigurations[instanceId]

    const labelWidth = getLabelWidth(portTemplate, portConfiguration)

    inputLabelWidths[instanceId] = labelWidth
  }

  const inputLabelColumnWidth = Math.max(...Object.values(inputLabelWidths), DIMENSIONS.NODE_PORT_MINIMUM_WIDTH)

  const outputs = Object.entries(node.outputs)
  const outputLabelWidths: Record<string, number> = {}

  for (const [instanceId, orderIndex] of outputs) {
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

  // Calculate label dx
  const labelDeltaX = [
    DIMENSIONS.NODE_INTERNAL_PADDING,
    inputLabelColumnWidth,
    DIMENSIONS.NODE_INTERNAL_PADDING,
    DIMENSIONS.NODE_LABEL_WIDTH / 2,
  ].reduce((sum, n) => sum + n, 0)

  return {
    totalWidth: nodeWidth,
    anchors: {
      labelDeltaX,
    },
  }
}
