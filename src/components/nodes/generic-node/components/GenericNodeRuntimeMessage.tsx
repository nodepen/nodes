import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DocumentNode } from '@/types'
import { useRuntimeMessages } from '../../hooks'
import { COLORS, DIMENSIONS } from '@/constants'
import { useImperativeEvent } from '@/hooks'
import { getNodeRuntimeMessageBubble } from '@/utils/node-geometry'
import { WiresMaskPortal } from '@/components/annotations/wire/components'
import { Dialog } from '@/views/components'
import { useNodeInternalState } from '../../context/node-state'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { useDispatch, useStore } from '@/store'

type GenericNodeRuntimeMessageProps = {
    node: DocumentNode
}

export const GenericNodeRuntimeMessage = ({ node }: GenericNodeRuntimeMessageProps) => {
    const { position } = useNodeInternalState()

    const nodeType = useMemo(() => {
        return getNodeTypeForTemplate(useStore.getState().templates[node.templateId])
    }, [node.templateId])

    const instanceId = node?.instanceId ?? ''
    const anchors = node?.anchors

    const { x, y } = position

    const [showDialog, setShowDialog] = useState(false)

    const messageContainerRef = useRef<SVGGElement>(null)

    const messages = useRuntimeMessages(instanceId)

    const currentMessage = messages[0]
    const currentMessageLevel = currentMessage?.level

    // Position of bottom-middle arrow "point"
    const dx = anchors?.['labelDeltaX']?.dx ?? 0
    const dy = -9

    const s = DIMENSIONS.NODE_RUNTIME_MESSAGE_BUBBLE_SIZE

    const handlePointerDown = useCallback((e: React.PointerEvent<SVGRectElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        setShowDialog(true)
    }, [])

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

    const tx = isVisible ? 0 : 50
    const bubbleTx = isVisible ? 0 : nodeType === 'generic-node' ? 0 : -10

    if (!node || node.status.isProvisional) {
        return null
    }

    const [arrow, bubble] = getNodeRuntimeMessageBubble(node, messageColors[visibleMessageLevel])

    return (
        <>
            <g
                ref={messageContainerRef}
                className="np-transition-transform np-duration-300 np-ease-out"
                style={{ transform: `translateY(${tx}px)` }}
            >
                <g
                    className='np-transition-transform np-duration-300 np-ease-out'
                    style={{ transform: `translateY(${bubbleTx}px)` }}>
                    {arrow}
                </g>
                {bubble}
                <rect
                    className={`${visibleMessageLevel === 'error'
                        ? 'np-fill-error hover:np-fill-error-2'
                        : 'np-fill-warn hover:np-fill-warn-2'
                        }  hover:np-cursor-pointer`}
                    style={{ pointerEvents: 'all' }}
                    onPointerDown={handlePointerDown}
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
                        transform: `translate(${position.x + dx - 12}px, ${position.y - 44
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
                    ></path>
                </svg>
            </g>
            <WiresMaskPortal>
                <g className="np-transition-transform np-duration-300 np-ease-out" style={{ transform: `translateY(${tx}px)` }}>
                    {...getNodeRuntimeMessageBubble(node, '#FFFFFF')}
                </g>
            </WiresMaskPortal>
            {showDialog ? (
                <Dialog onClose={() => setShowDialog(false)}>
                    <div className="np-w-full np-p-2 np-pl-4 np-pr-4 np-flex np-items-center np-justify-between np-pointer-events-auto">
                        <p className="np-font-sans np-font-medium np-text-dark np-text-md">{currentMessage?.message}</p>
                        {/* <div className="np-w-4 np-h-full np-flex np-items-center np-justify-center" onClick={() => setShowDialog(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={COLORS.DARK} className="np-size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" vectorEffect="non-scaling-stroke" />
                            </svg>
                        </div> */}
                    </div>
                </Dialog>
            ) : null}
        </>
    )
}
