import React from 'react'
import type { DocumentNode } from '@nodepen/core'
import { DIMENSIONS } from '@/constants'

export const getNodeRuntimeMessageBubble = (node: DocumentNode, fillColor: string) => {
  const { anchors, position } = node
  const { x, y } = position

  // Position of bottom-middle arrow "point"
  const dx = anchors['labelDeltaX'].dx
  const dy = -9

  const s = DIMENSIONS.NODE_RUNTIME_MESSAGE_BUBBLE_SIZE

  return (
    <>
      <rect
        style={{
          transform: 'rotate(45deg)',
          transformOrigin: `${x + dx}px ${y + dy - s / 4}px`,
        }}
        x={x + dx - s / 4}
        y={y + dy - s / 2}
        width={s / 2}
        height={s / 2}
        fill={fillColor}
        rx={2}
        ry={2}
      />
      <rect x={x + dx - s / 2} y={y + dy - 6 - s} width={s} height={s} fill={fillColor} rx={6} ry={6} />
    </>
  )
}
