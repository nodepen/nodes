import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { DocumentNode } from '@nodepen/core'
import { useRuntimeMessages } from '../../hooks'
import { COLORS, DIMENSIONS } from '@/constants'
import { useImperativeEvent } from '@/hooks'
import { getNodeRuntimeMessageBubble } from '@/utils/node-geometry'
import { WiresMaskPortal } from '@/components/annotations/wire/components'
import { Dialog } from '@/views/components'

type GenericNodeRuntimeMessageProps = {
  node: DocumentNode
}

export const GenericNodeRuntimeMessage = ({ node }: GenericNodeRuntimeMessageProps) => {
  const { instanceId, anchors, position } = node
  const { x, y } = position

  const [showDialog, setShowDialog] = useState(false)

  const messageContainerRef = useRef<SVGGElement>(null)

  const messages = useRuntimeMessages(instanceId)

  const currentMessage = messages[0]
  const currentMessageLevel = currentMessage?.level

  // Position of bottom-middle arrow "point"
  const dx = anchors['labelDeltaX'].dx
  const dy = -9

  const s = DIMENSIONS.NODE_RUNTIME_MESSAGE_BUBBLE_SIZE

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      e.stopPropagation()
      console.log(messages[0]?.message)

      // TODO: Show message somehow
      setShowDialog(true)
    },
    [messages]
  )

  useImperativeEvent(messageContainerRef, 'pointerdown', handlePointerDown)

  const [isVisible, setIsVisible] = useState(false)
  const [visibleMessageLevel, setVisibleMessageLevel] = useState<typeof currentMessageLevel>('info')

  useEffect(() => {
    if (!currentMessage) {
      setIsVisible(false)
      return
    }

    setVisibleMessageLevel(currentMessage.level)
    setIsVisible(true)
  }, [currentMessage])

  const messageColors: Record<typeof currentMessageLevel, string> = {
    error: COLORS.ERROR,
    warning: COLORS.WARN,
    info: COLORS.GREEN,
  }

  const tx = isVisible ? 0 : 80

  return (
    <>
      <g
        ref={messageContainerRef}
        className="np-transition-transform np-duration-300 np-ease-out"
        style={{ transform: `translateY(${tx}px)` }}
      >
        {getNodeRuntimeMessageBubble(node, messageColors[visibleMessageLevel])}
        <rect
          className={`${
            visibleMessageLevel === 'error'
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
        <svg
          width={24}
          height={24}
          style={{
            transform: `translate(${node.position.x + node.anchors['labelDeltaX'].dx - 12}px, ${
              node.position.y - 44
            }px)`,
          }}
          aria-hidden="true"
          fill="none"
          stroke={COLORS.DARK}
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="np-pointer-events-none"
        >
          <path
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          ></path>
        </svg>
      </g>
      <WiresMaskPortal>
        <g className="np-transition-transform np-duration-300 np-ease-out" style={{ transform: `translateY(${tx}px)` }}>
          {getNodeRuntimeMessageBubble(node, '#FFFFFF')}
        </g>
      </WiresMaskPortal>
      {showDialog ? (
        <Dialog onClose={() => setShowDialog(false)}>
          <p className="np-font-sans np-font-medium np-text-dark np-text-md">{messages[0].message}</p>
        </Dialog>
      ) : null}
    </>
  )
}
