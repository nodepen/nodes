import type * as NodePen from '@nodepen/core'
import { DIMENSIONS } from '@/constants'

export const getNodeHeight = (template: NodePen.NodeTemplate): number => {
  const { inputs, outputs, nickName } = template

  const inputPortsHeight = inputs.length * DIMENSIONS.NODE_PORT_HEIGHT
  const outputPortsHeight = outputs.length * DIMENSIONS.NODE_PORT_HEIGHT
  const minimumLabelHeight = nickName.length * 15 // not monospace, estimate

  const nodeContentHeight = Math.max(
    DIMENSIONS.NODE_MINIMUM_HEIGHT,
    inputPortsHeight,
    outputPortsHeight,
    minimumLabelHeight
  )

  const nodeHeight = DIMENSIONS.NODE_INTERNAL_PADDING * 2 + nodeContentHeight

  return nodeHeight
}
