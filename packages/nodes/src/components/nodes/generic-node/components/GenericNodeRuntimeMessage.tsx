import React, { useCallback, useRef } from 'react'
import type { DocumentNode } from '@nodepen/core'
import { useRuntimeMessages } from '../../hooks'
import { COLORS, DIMENSIONS } from '@/constants'
import { useImperativeEvent } from '@/hooks'
import { getNodeRuntimeMessageBubble } from '@/utils/node-geometry'
import { WiresMaskPortal } from '@/components/annotations/wire/components'

type GenericNodeRuntimeMessageProps = {
  node: DocumentNode
}

export const GenericNodeRuntimeMessage = ({ node }: GenericNodeRuntimeMessageProps) => {
  const { instanceId, anchors, position } = node
  const { x, y } = position

  const messageContainerRef = useRef<SVGGElement>(null)

  const messages = useRuntimeMessages(instanceId)

  const currentMessage = messages[0]
  const currentMessageLevel = currentMessage?.level

  const messageColors: Record<typeof currentMessageLevel, string> = {
    error: COLORS.ERROR,
    warning: COLORS.WARN,
    info: COLORS.GREEN,
  }

  // Position of bottom-middle arrow "point"
  const dx = anchors['labelDeltaX'].dx
  const dy = -9

  const s = DIMENSIONS.NODE_RUNTIME_MESSAGE_BUBBLE_SIZE

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      e.stopPropagation()
      console.log(messages[0]?.message)

      // TODO: Show message somehow
    },
    [messages]
  )

  useImperativeEvent(messageContainerRef, 'pointerdown', handlePointerDown)

  if (!currentMessage) {
    return null
  }

  return (
    <>
      <g ref={messageContainerRef}>
        {getNodeRuntimeMessageBubble(node, messageColors[currentMessageLevel])}
        <rect
          className={`${currentMessageLevel === 'error'
              ? 'np-fill-error hover:np-fill-error-2'
              : 'np-fill-warn hover:np-fill-warn-2'
            }  hover:np-cursor-pointer np-pointer-events-auto`}
          x={x + dx + 3 - s / 2}
          y={y + dy - 3 - s}
          width={s - 6}
          height={s - 6}
          rx={3}
          ry={3}
        />
      </g>
      <WiresMaskPortal>
        <g>{getNodeRuntimeMessageBubble(node, '#FFFFFF')}</g>
      </WiresMaskPortal>
    </>
  )
}
