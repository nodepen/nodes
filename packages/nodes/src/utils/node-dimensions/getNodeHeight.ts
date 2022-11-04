import type * as NodePen from '@nodepen/core'
import { DIMENSIONS } from '@/constants'

const { NODE_INTERNAL_PADDING, NODE_MINIMUM_HEIGHT, NODE_PORT_MINIMUM_HEIGHT } = DIMENSIONS

export const getNodeHeight = (template: NodePen.NodeTemplate): number => {
  const { inputs, outputs } = template

  const nodeParameterHeight = Math.max(inputs.length, outputs.length, 1) * NODE_PORT_MINIMUM_HEIGHT
  const nodeContentHeight = Math.max(nodeParameterHeight, NODE_MINIMUM_HEIGHT)
  const nodeHeight = NODE_INTERNAL_PADDING * 2 + nodeContentHeight

  return nodeHeight
}