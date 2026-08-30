import { AgentIcon } from "@/components/icons/AgentIcon"
import { COLORS } from "@/constants"
import { useDispatch, useStore, useStoreRef } from "$"
import { useImperativeEvent, usePageSpaceToWorldSpace } from "@/hooks"
import { useIsEditable } from "@/hooks/useIsEditable"
import { current } from "immer"
import React, { useCallback, useRef } from "react"
import { shallow } from "zustand/shallow"

type Props = {
    bubbleId: string
}

const useDraggableBubble = (bubbleId: string): React.RefObject<SVGGElement | null> => {
    const draggableRef = useRef<SVGGElement>(null)

    const isEditable = useIsEditable()

    const { apply } = useDispatch()

    const zoom = useStoreRef((state) => state.camera.zoom)

    const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

    const getCurrentBubblePosition = (): { x: number; y: number } => {
        return useStore.getState().registry.agent.bubbles[bubbleId]?.position ?? { x: 0, y: 0 }
    }

    const isDragging = useRef(false)
    const initialPointerId = useRef<number>(undefined)
    const initialPointerPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const initialBubblePosition = useRef<{ x: number; y: number }>(getCurrentBubblePosition())

    const handlePointerDown = useCallback((e: PointerEvent): void => {
        const container = draggableRef.current

        if (!container) {
            return
        }

        if (isDragging.current) {
            // Already dragging, discard event
            return
        }

        const { pageX, pageY, pointerId } = e

        switch (e.pointerType) {
            case 'pen':
            case 'touch': {
                // TODO: Support touch events
                return
            }
            case 'mouse': {
                switch (e.button) {
                    case 0: {
                        // Handle left mouse down
                        e.stopPropagation()

                        // Register main pointer
                        initialPointerId.current = pointerId
                        container.setPointerCapture(pointerId)

                        if (!isEditable) {
                            return
                        }

                        // Begin motion
                        isDragging.current = true
                        initialBubblePosition.current = getCurrentBubblePosition()
                        initialPointerPosition.current = { x: pageX, y: pageY }

                        return
                    }
                    case 1: {
                        // Handle center mouse down
                        return
                    }
                    case 2: {
                        // Handle right mouse down
                        return
                    }
                }
            }
        }
    }, [isEditable, bubbleId])

    const handlePointerMove = useCallback((e: PointerEvent): void => {
        const { pageX: currentPointerX, pageY: currentPointerY, pointerId } = e

        if (!isDragging.current || pointerId !== initialPointerId.current) {
            return
        }

        const { x: initialPointerX, y: initialPointerY } = initialPointerPosition.current

        const dx = (currentPointerX - initialPointerX) / zoom.current
        const dy = (currentPointerY - initialPointerY) / zoom.current

        const { x: initialBubbleX, y: initialBubbleY } = initialBubblePosition.current

        apply((state) => {
            const bubble = state.registry.agent.bubbles[bubbleId]

            if (bubble) {
                bubble.position = {
                    x: initialBubbleX + dx,
                    y: initialBubbleY + dy,
                }
            }

            const [cx, cy] = pageSpaceToWorldSpace(currentPointerX, currentPointerY)

            state.ui.cursor = {
                x: cx,
                y: cy
            }

            state.callbacks.onCursorMove?.(current(state))
        })
    }, [bubbleId])

    const resetState = useCallback((): void => {
        isDragging.current = false
        initialPointerId.current = undefined
    }, [])

    const handlePointerUp = useCallback((e: PointerEvent): void => {
        const { pointerId } = e

        if (pointerId !== initialPointerId.current) {
            return
        }

        resetState()
    }, [resetState])

    const handlePointerCancel = useCallback((e: PointerEvent): void => {
        const { pointerId } = e

        if (pointerId !== initialPointerId.current) {
            return
        }

        resetState()
    }, [resetState])

    useImperativeEvent(draggableRef, 'pointerdown', handlePointerDown)
    useImperativeEvent(draggableRef, 'pointermove', handlePointerMove)
    useImperativeEvent(draggableRef, 'pointerup', handlePointerUp)
    useImperativeEvent(draggableRef, 'pointercancel', handlePointerCancel)

    return draggableRef
}

const AgentBubble = ({ bubbleId }: Props) => {
    const bubbleData = useStore((state) => state.registry.agent.bubbles[bubbleId], shallow)

    const draggableRef = useDraggableBubble(bubbleId)

    if (!bubbleData) {
        return null
    }

    const margin = 24
    const width = 200

    const { ref, position, message, type } = bubbleData
    const { x, y } = position

    return <g id={`agent-bubble-${bubbleId}`}>
        <rect x={x - margin} y={y - margin} width={width + 2 * margin} height={margin * 2} rx={6} ry={6} fill={COLORS.LIGHT} />
        <foreignObject x={x - margin} y={y - margin} width={width + 2 * margin} height={500} className="np-overflow-visible">
            <div ref={ref} className="np-w-full np-overflow-visible" />
        </foreignObject>
        <g ref={draggableRef} className="np-pointer-events-auto hover:np-cursor-grab">
            <path id={`bubble-title-path-${bubbleId}`} d={`M ${x + margin} ${y + 1} L ${x + width - margin} ${y + 1}`} />
            {/* <text
                className="np-font-panel np-select-none np-pointer-events-none"
                fill={COLORS.DARK}
                fontSize={16}
                dominantBaseline="middle"
            >
                <textPath href={`#bubble-title-path-${bubbleId}`} startOffset="0%" textAnchor="start">
                    {message}
                </textPath>
            </text> */}
            <svg width={32} height={32} x={x - 16} y={y - 16}>
                <circle cx={16} cy={16} r={20} fill={COLORS.LIGHT} />
                <AgentIcon width={32} height={32} fill={COLORS.DARK} mode="idle" />
            </svg>
            <rect x={x - margin} y={y - margin} width={32} height={200} fill="none" />
        </g>
    </g>
}

export default React.memo(AgentBubble)
