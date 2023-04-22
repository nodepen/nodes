import type * as NodePen from '@nodepen/core'

export const getNodeExtents = (node: NodePen.DocumentNode) => {
  const { position, dimensions } = node

  return {
    from: {
      x: position.x,
      y: position.y,
    },
    to: {
      x: position.x + dimensions.width,
      y: position.y + dimensions.height,
    },
  }
}
