import React, { useCallback, useRef } from 'react'
import type { DocumentNode } from '@nodepen/core'
import { useRuntimeMessages } from '../../hooks'
import { COLORS, DIMENSIONS } from '@/constants'
import { useImperativeEvent } from '@/hooks'

type GenericNodeRuntimeMessageProps = {
  node: DocumentNode
}

export const GenericNodeRuntimeMessage = ({ node }: GenericNodeRuntimeMessageProps) => {
  const { instanceId, anchors, position } = node
  const { x, y } = position

  const messageContainerRef = useRef<SVGGElement>(null)

  const messages = useRuntimeMessages(instanceId)

  // Position of bottom-middle arrow "point"
  const dx = anchors['labelDeltaX'].dx
  const dy = -9

  const BUBBLE_SIZE = DIMENSIONS.NODE_LABEL_WIDTH + 2

  const handlePointerDown = useCallback((e: PointerEvent) => {
    e.stopPropagation()

    // TODO: Show message somehow
  }, [])

  useImperativeEvent(messageContainerRef, 'pointerdown', handlePointerDown)

  return (
    <g ref={messageContainerRef}>
      <rect
        style={{
          transform: 'rotate(45deg)',
          transformOrigin: `${x + dx}px ${y + dy - BUBBLE_SIZE / 4}px`,
        }}
        x={x + dx - BUBBLE_SIZE / 4}
        y={y + dy - BUBBLE_SIZE / 2}
        width={BUBBLE_SIZE / 2}
        height={BUBBLE_SIZE / 2}
        fill={COLORS.ERROR}
        rx={2}
        ry={2}
      />
      <rect
        x={x + dx - BUBBLE_SIZE / 2}
        y={y + dy - 6 - BUBBLE_SIZE}
        width={BUBBLE_SIZE}
        height={BUBBLE_SIZE}
        fill={COLORS.ERROR}
        rx={6}
        ry={6}
      />
      <rect
        className="np-fill-error hover:np-fill-error-2 hover:np-cursor-pointer np-pointer-events-auto"
        x={x + dx + 3 - BUBBLE_SIZE / 2}
        y={y + dy - 3 - BUBBLE_SIZE}
        width={BUBBLE_SIZE - 6}
        height={BUBBLE_SIZE - 6}
        fill={COLORS.DARKGREEN}
        rx={3}
        ry={3}
      />
    </g>
  )
}
