import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useDispatch, useStore, useStoreRef } from "$"
import type { NodesAppStore } from "$"
import { COLORS, DIMENSIONS } from "@/constants"
import { getNodeExtents } from "@/utils/node-dimensions"
import { shallow } from "zustand/shallow"
import { useImperativeEvent, usePageSpaceToOverlaySpace, usePageSpaceToWorldSpace } from "@/hooks"
import { useIsEditable } from "@/hooks/useIsEditable"
import { useRightClick } from "@/hooks/useRightClick"
import { lerpPoint2d, useInterpolatedState } from "@/hooks/useInteroplatedState"
import { isCtrl } from "@/utils/dom/isCtrl"
import { targetIsScrolling } from "@/utils/dom/targetIsScrolling"
import { isNodeIncludedInDrag } from "@/store/utils"
import { saveDocument } from "@/store/utils/saveDocument"
import { current } from "immer"

const {
    GROUP_PADDING,
    GROUP_BORDER_RADIUS,
    GROUP_BORDER_WIDTH,
    GROUP_FILL_OPACITY,
    GROUP_LABEL_HEIGHT,
    GROUP_LABEL_PADDING_X,
    GROUP_LABEL_GAP,
    NODE_LABEL_FONT_SIZE,
} = DIMENSIONS

type GroupProps = {
    id: string
}

type Rect = {
    x: number
    y: number
    width: number
    height: number
}

type Point = {
    x: number
    y: number
}

/** Expands all four sides of a rect. */
const cellAt = (rect: Rect, amount: number): Rect => ({
    x: rect.x - amount,
    y: rect.y - amount,
    width: rect.width + amount * 2,
    height: rect.height + amount * 2,
})

/** Bounding box of a set of rects. */
const mergeRects = (rects: Rect[]): Rect => {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (const { x, y, width, height } of rects) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x + width)
        maxY = Math.max(maxY, y + height)
    }

    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}

/** First session currently dragging a node via presence, if any. */
const getPresenceDragPosition = (state: NodesAppStore, nodeInstanceId: string) => {
    const drags = state.presence.drag[nodeInstanceId]

    if (!drags) {
        return null
    }

    for (const sessionId of Object.keys(state.presence.sessions)) {
        const drag = drags[sessionId]

        if (drag) {
            return drag
        }
    }

    return null
}

type PresenceDragOverrideProps = {
    nodeInstanceId: string
    onChange: (nodeInstanceId: string, position: Point | null) => void
}

const GroupPresenceDragOverride = React.memo(({ nodeInstanceId, onChange }: PresenceDragOverrideProps) => {
    const rawDrag = useStore((state) => {
        const drag = getPresenceDragPosition(state, nodeInstanceId)
        return drag ? { x: drag.x, y: drag.y } : null
    }, shallow)

    const [position, setPosition] = useInterpolatedState(rawDrag ?? { x: 0, y: 0 }, lerpPoint2d)
    const previousRawDrag = useRef(rawDrag)

    useEffect(() => {
        if (!rawDrag) {
            previousRawDrag.current = null
            return
        }

        setPosition(rawDrag, { immediate: previousRawDrag.current === null })
        previousRawDrag.current = rawDrag
    }, [rawDrag?.x, rawDrag?.y])

    useEffect(() => {
        onChange(nodeInstanceId, position)
    }, [nodeInstanceId, position.x, position.y, onChange])

    useEffect(() => {
        return () => onChange(nodeInstanceId, null)
    }, [nodeInstanceId, onChange])

    return null
})

const useSelectableGroup = (groupId: string) => {
    const selectableRef = useRef<SVGGElement>(null)

    const { apply } = useDispatch()

    const handlePointerDown = useCallback((e: PointerEvent) => {
        switch (e.pointerType) {
            case 'mouse': {
                switch (e.button) {
                    case 0: {
                        if (e.shiftKey) {
                            // Add to selection
                            apply((state) => {
                                state.registry.selection.groups.push(groupId)
                            })
                            return
                        }

                        if (isCtrl(e)) {
                            // Remove from selection
                            apply((state) => {
                                state.registry.selection.groups = state.registry.selection.groups.filter((id) => id !== groupId)
                            })
                            return
                        }

                        if (useStore.getState().registry.selection.groups.includes(groupId)) {
                            return
                        }

                        // Set as selection
                        apply((state) => {
                            state.registry.selection.groups = [groupId]
                            state.registry.selection.nodes = []
                        })
                        return
                    }
                    case 1:
                    case 2: {
                        break
                    }
                }
                break
            }
            case 'pen':
            case 'touch': {
                break;
            }
        }
    }, [])

    useImperativeEvent(selectableRef, 'pointerdown', handlePointerDown)

    return selectableRef
}

const useDraggableGroup = (groupId: string): React.RefObject<SVGGElement | null> => {
    const draggableRef = useRef<SVGGElement>(null)

    const isEditable = useIsEditable()

    const { apply, endDrag } = useDispatch()

    const zoom = useStoreRef((state) => state.camera.zoom)

    const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

    const isDragging = useRef(false)
    const initialPointerId = useRef<number>(undefined)
    const initialPointerPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

    const setIsDragging = useCallback((isActive: boolean): void => {
        isDragging.current = isActive
        apply((state) => {
            state.registry.drag.isActive = isActive
        })
    }, [])

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
                        setIsDragging(true)
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
    }, [isEditable])

    const handlePointerMove = useCallback((e: PointerEvent): void => {
        const { pageX: currentPointerX, pageY: currentPointerY, pointerId } = e

        if (!isDragging.current || pointerId !== initialPointerId.current) {
            return
        }

        if (targetIsScrolling(e)) {
            return
        }

        const { x: initialPointerX, y: initialPointerY } = initialPointerPosition.current

        const dx = (currentPointerX - initialPointerX) / zoom.current
        const dy = (currentPointerY - initialPointerY) / zoom.current

        apply((state) => {
            state.registry.drag.dx = dx
            state.registry.drag.dy = dy

            const [cx, cy] = pageSpaceToWorldSpace(currentPointerX, currentPointerY)

            state.ui.cursor = {
                x: cx,
                y: cy
            }

            state.callbacks.onCursorMove?.(current(state))
            state.callbacks.onDrag?.(current(state))
        })
    }, [])

    const resetState = useCallback((): void => {
        endDrag()
        setIsDragging(false)
        initialPointerId.current = undefined
    }, [])

    const handlePointerUp = useCallback((e: PointerEvent): void => {
        const { pointerId, pageX: currentPointerX, pageY: currentPointerY } = e

        if (pointerId !== initialPointerId.current) {
            return
        }

        const { x: initialPointerX, y: initialPointerY } = initialPointerPosition.current

        const dx = (currentPointerX - initialPointerX) / zoom.current
        const dy = (currentPointerY - initialPointerY) / zoom.current

        resetState()

        if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
            apply((state) => {
                saveDocument(state)
            })
        }
    }, [resetState])

    const handlePointerCancel = useCallback((e: PointerEvent): void => {
        const { pointerId } = e

        if (pointerId !== initialPointerId.current) {
            return
        }

        resetState()
    }, [])

    useImperativeEvent(draggableRef, 'pointerdown', handlePointerDown)
    useImperativeEvent(draggableRef, 'pointermove', handlePointerMove)
    useImperativeEvent(draggableRef, 'pointerup', handlePointerUp)
    useImperativeEvent(draggableRef, 'pointercancel', handlePointerCancel)

    return draggableRef
}

const Group = ({ id }: GroupProps) => {
    const selectableRef = useSelectableGroup(id)
    const draggableRef = useDraggableGroup(id)

    const { apply } = useDispatch()

    const isEditable = useIsEditable()

    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const handleRightClick = useCallback((e: PointerEvent) => {
        e.stopPropagation()
        e.preventDefault()

        if (!isEditable) {
            return
        }

        const { pageX, pageY } = e

        const key = `group-menu-${id}`

        const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

        apply((state) => {
            state.registry.contextMenus[key] = {
                position: { x, y },
                context: {
                    type: 'group',
                    groupId: id,
                }
            }
        })
    }, [isEditable, pageSpaceToOverlaySpace, id])

    const rightClickRef = useRightClick(handleRightClick, true)

    const groupColor = useStore((state) => state.document.groups[id]?.color)
    const isSelected = useStore((state) => state.registry.selection.groups.includes(id))
    const groupLabel = useStore((state) => state.document.groups[id]?.label)

    const color = isSelected ? COLORS.GREEN : groupColor

    const labelTextRef = useRef<SVGTextElement>(null)
    const [labelTextWidth, setLabelTextWidth] = useState(0)

    useLayoutEffect(() => {
        setLabelTextWidth(labelTextRef.current?.getComputedTextLength() ?? 0)
    }, [groupLabel])

    // Rects based on in-session sync values
    const baseNodeValues = useStore((state) => {
        const group = state.document.groups[id]

        if (!group) {
            return []
        }

        const values: (string | number)[] = []

        for (const nodeInstanceId of group.items.nodes) {
            const node = state.document.nodes[nodeInstanceId]

            if (!node) {
                continue
            }

            const { from, to } = getNodeExtents(node)

            let x = from.x
            let y = from.y

            if (state.registry.drag.isActive && isNodeIncludedInDrag(state, nodeInstanceId)) {
                // Include active local drags in group calculation
                const { dx, dy } = state.registry.drag

                x += dx
                y += dy
            }

            values.push(nodeInstanceId, x, y, to.x - from.x, to.y - from.y)
        }

        return values
    }, shallow)

    // Rects based on presence, only active is there is any presence data
    const [dragOverrides, setDragOverrides] = useState<Record<string, Point>>({})

    const presenceDraggedNodeIds = useStore((state) => {
        const group = state.document.groups[id]

        if (!group) {
            return []
        }

        const ids: string[] = []

        for (const nodeInstanceId of group.items.nodes) {
            if (state.document.nodes[nodeInstanceId] && getPresenceDragPosition(state, nodeInstanceId)) {
                ids.push(nodeInstanceId)
            }
        }

        return ids
    }, shallow)


    const handleDragOverrideChange = useCallback((nodeInstanceId: string, position: Point | null) => {
        setDragOverrides((prev) => {
            if (!position) {
                if (!(nodeInstanceId in prev)) {
                    return prev
                }

                const next = { ...prev }
                delete next[nodeInstanceId]
                return next
            }

            const existing = prev[nodeInstanceId]

            if (existing && existing.x === position.x && existing.y === position.y) {
                return prev
            }

            return { ...prev, [nodeInstanceId]: position }
        })
    }, [])

    if (!color || baseNodeValues.length === 0) {
        return null
    }

    const nodeRects: Rect[] = []

    for (let i = 0; i < baseNodeValues.length; i += 5) {
        const nodeInstanceId = baseNodeValues[i] as string
        const override = dragOverrides[nodeInstanceId]

        nodeRects.push({
            x: override ? override.x : (baseNodeValues[i + 1] as number),
            y: override ? override.y : (baseNodeValues[i + 2] as number),
            width: baseNodeValues[i + 3] as number,
            height: baseNodeValues[i + 4] as number,
        })
    }

    const groupRect = cellAt(mergeRects(nodeRects), GROUP_PADDING)

    return (
        <>
            {presenceDraggedNodeIds.map((nodeInstanceId) => (
                <GroupPresenceDragOverride
                    key={nodeInstanceId}
                    nodeInstanceId={nodeInstanceId}
                    onChange={handleDragOverrideChange}
                />
            ))}
            <g ref={rightClickRef} className="np-pointer-events-auto">
                <g ref={draggableRef} className="np-pointer-events-auto">
                    <g ref={selectableRef} className="np-pointer-events-auto">
                        <rect
                            x={groupRect.x}
                            y={groupRect.y}
                            width={groupRect.width}
                            height={groupRect.height}
                            rx={GROUP_BORDER_RADIUS}
                            ry={GROUP_BORDER_RADIUS}
                            fill={COLORS.PALE}
                            fillOpacity={0.5}
                        />
                        <rect
                            x={groupRect.x}
                            y={groupRect.y}
                            width={groupRect.width}
                            height={groupRect.height}
                            rx={GROUP_BORDER_RADIUS}
                            ry={GROUP_BORDER_RADIUS}
                            fill={color}
                            fillOpacity={GROUP_FILL_OPACITY}
                        />
                        <rect
                            x={groupRect.x - 1}
                            y={groupRect.y - 1}
                            width={groupRect.width + 2}
                            height={groupRect.height + 2}
                            rx={GROUP_BORDER_RADIUS + 1}
                            ry={GROUP_BORDER_RADIUS + 1}
                            fill="none"
                            stroke={COLORS.PALE}
                            strokeWidth={2}
                        />
                        <rect
                            x={groupRect.x}
                            y={groupRect.y}
                            width={groupRect.width}
                            height={groupRect.height}
                            rx={GROUP_BORDER_RADIUS}
                            ry={GROUP_BORDER_RADIUS}
                            fill="none"
                            stroke={color}
                            strokeWidth={GROUP_BORDER_WIDTH}
                            vectorEffect="non-scaling-stroke"
                        />
                        {groupLabel?.trim() ? (
                            <>
                                <rect
                                    x={groupRect.x}
                                    y={groupRect.y - GROUP_LABEL_GAP - GROUP_LABEL_HEIGHT}
                                    width={labelTextWidth + GROUP_LABEL_PADDING_X * 2}
                                    height={GROUP_LABEL_HEIGHT}
                                    rx={GROUP_BORDER_RADIUS}
                                    ry={GROUP_BORDER_RADIUS}
                                    fill={groupColor}
                                    fillOpacity={GROUP_FILL_OPACITY}
                                />
                                <text
                                    ref={labelTextRef}
                                    className="np-font-panel np-select-none np-pointer-events-none"
                                    x={groupRect.x + GROUP_LABEL_PADDING_X}
                                    y={groupRect.y - GROUP_LABEL_GAP - GROUP_LABEL_HEIGHT / 2}
                                    dominantBaseline="middle"
                                    fill={groupColor}
                                    fontSize={NODE_LABEL_FONT_SIZE}
                                >
                                    {groupLabel}
                                </text>
                            </>
                        ) : null}
                    </g>
                </g>
            </g>
        </>
    )
}

export default React.memo(Group, (prev, next) => prev.id === next.id)
