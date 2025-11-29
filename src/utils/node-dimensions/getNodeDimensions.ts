import type * as NodePen from '@nodepen/core'
import { DIMENSIONS } from '@/constants'
import { clamp } from '@/utils/numerics'
import { getNodeHeight, getNodeWidth } from '.'

export const getNodeDimensions = (
  node: NodePen.DocumentNode,
  nodeTemplate: NodePen.NodeTemplate
): Pick<NodePen.DocumentNode, 'anchors' | 'dimensions'> => {
  const nodeDimensions: Pick<NodePen.DocumentNode, 'anchors' | 'dimensions'> = {
    anchors: {
      labelDeltaX: {
        dx: 0,
        dy: 0,
      },
    },
    dimensions: {
      width: 0,
      height: 0,
    },
  }

  // Calculate current extents
  const { totalWidth: nodeWidth, anchors } = getNodeWidth(node, nodeTemplate)
  nodeDimensions.dimensions.width = nodeWidth

  nodeDimensions.anchors = { ...nodeDimensions.anchors, labelDeltaX: { dx: anchors.labelDeltaX, dy: 0 } }

  const nodeHeight = getNodeHeight(nodeTemplate)
  nodeDimensions.dimensions.height = nodeHeight

  // Calculate port anchors (center based on height)
  const inputInstanceIds = Object.keys(node.inputs)
  const outputInstanceIds = Object.keys(node.outputs)

  const deltaYMax = (portCount: number): number => {
    return ((clamp(portCount - 1, 0, Number.MAX_SAFE_INTEGER) - 1) * DIMENSIONS.NODE_PORT_HEIGHT) / 2
  }

  const deltaYStart = (portCount: number): number => {
    return nodeHeight / 2 - deltaYMax(portCount) - DIMENSIONS.NODE_PORT_HEIGHT / 2
  }

  const dyStartInputs = deltaYStart(inputInstanceIds.length)

  for (let i = 0; i < inputInstanceIds.length; i++) {
    const instanceId = inputInstanceIds[i]

    const dx = 0
    const dy = dyStartInputs + DIMENSIONS.NODE_PORT_HEIGHT * i

    nodeDimensions.anchors[instanceId] = { dx, dy }
  }

  const dyStartOutputs = deltaYStart(outputInstanceIds.length)

  for (let i = 0; i < outputInstanceIds.length; i++) {
    const instanceId = outputInstanceIds[i]

    const dx = nodeWidth
    const dy = dyStartOutputs + DIMENSIONS.NODE_PORT_HEIGHT * i

    nodeDimensions.anchors[instanceId] = { dx, dy }
  }

  return nodeDimensions
}
