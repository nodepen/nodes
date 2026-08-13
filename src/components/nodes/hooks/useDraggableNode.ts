import type React from 'react'
import { useCallback, useRef } from 'react'
import { useDispatch, useStore, useStoreRef } from '$'
import { useImperativeEvent, usePageSpaceToWorldSpace } from '@/hooks'
import { saveDocument } from '@/store/utils/saveDocument'
import { targetIsScrollable } from '@/utils/dom/targetIsScrollable'
import { targetIsScrolling } from '@/utils/dom/targetIsScrolling'
import { getProvisionalId } from '@/utils/nodes/getProvisionalId'
import { current } from 'immer'
import { useIsEditable } from '@/hooks/useIsEditable'

export const useDraggableNode = (nodeInstanceId: string): React.RefObject<SVGGElement | null> => {
    const nodeRef = useRef<SVGGElement>(null)

    const isEditable = useIsEditable()

    const { apply, endDrag, setNodePosition } = useDispatch()

    const zoom = useStoreRef((state) => state.camera.zoom)

    const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

    const getCurrentNodePosition = (id: string): { x: number; y: number } => {
        return useStore.getState().document.nodes[id]?.position ?? { x: 0, y: 0 }
    }

    const isDragging = useRef(false)
    const initialPointerId = useRef<number>(undefined)
    const initialPointerPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const initialNodePosition = useRef<{ x: number; y: number }>(getCurrentNodePosition(nodeInstanceId))

    const setIsDragging = useCallback((isActive: boolean): void => {
        isDragging.current = isActive
        apply((state) => {
            state.registry.drag.isActive = isActive
        })
    }, [])

    const handlePointerDown = useCallback((e: PointerEvent): void => {
        const container = nodeRef.current

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
                        initialNodePosition.current = getCurrentNodePosition(nodeInstanceId)
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

        const { x: initialNodeX, y: initialNodeY } = initialNodePosition.current

        const currentNodeX = initialNodeX + dx
        const currentNodeY = initialNodeY + dy

        if (useStore.getState().registry.drag.isCopyActive) {
            const { x: previousNodeX, y: previousNodeY } = getCurrentNodePosition(getProvisionalId(nodeInstanceId))

            const stepX = currentNodeX - previousNodeX
            const stepY = currentNodeY - previousNodeY

            apply((state) => {
                for (const instanceId of useStore.getState().clipboard.nodes.map((node) => node.instanceId)) {
                    const provisionalNode = state.document.nodes[getProvisionalId(instanceId)]

                    if (!provisionalNode) {
                        continue
                    }

                    provisionalNode.position = {
                        x: provisionalNode.position.x + stepX,
                        y: provisionalNode.position.y + stepY
                    }
                }
            })

            // Do not move nodes while drag copy is active
            return
        }
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

    useImperativeEvent(nodeRef, 'pointerdown', handlePointerDown)
    useImperativeEvent(nodeRef, 'pointermove', handlePointerMove)
    useImperativeEvent(nodeRef, 'pointerup', handlePointerUp)
    useImperativeEvent(nodeRef, 'pointercancel', handlePointerCancel)

    return nodeRef
}
