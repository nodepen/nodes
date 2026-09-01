import React, { useRef, useEffect, useCallback } from 'react'
import { rafBatcher, useStore, useStoreRef, useDispatch } from '$'
import { CAMERA } from '@/constants'
import { clamp } from '@/utils'
import { usePageSpaceToOverlaySpace, usePageSpaceToWorldSpace } from '@/hooks'
import { distance } from '@/utils/numerics'
import { targetIsScrollable } from '@/utils/dom/targetIsScrollable'
import { current } from 'immer'
import { useIsEditable } from '@/hooks/useIsEditable'

type CameraControlProps = {
    children?: React.ReactNode
}

const CameraOverlay = ({ children }: CameraControlProps): React.ReactElement => {
    const cameraControlOverlayRef = useRef<HTMLDivElement>(null)

    const isEditable = useIsEditable()

    const { apply, clearInterface, clearSelection } = useDispatch()
    const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const zoom = useStoreRef((state) => state.camera.zoom)

    const lastPointerType = useRef<'mouse' | 'touch' | 'pen'>('mouse')

    const activeTouches = useRef(new Map<number, { x: number; y: number }>());
    const previousPinch = useRef<{ dist: number; mid: { x: number, y: number } } | null>(null);

    const initialCameraPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const initialPagePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const initialWorldPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

    const activePointerId = useRef<number>(undefined)
    const isPanActive = useRef(false)
    const isRegionSelectActive = useRef(false)

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
        e.stopPropagation()
        clearInterface()

        lastPointerType.current = e.pointerType

        if (isPanActive.current) {
            return
        }

        const cameraElement = cameraControlOverlayRef.current

        if (!cameraElement) {
            return
        }

        switch (e.pointerType) {
            case 'mouse': {
                const { pageX, pageY } = e

                switch (e.button) {
                    case 0: {
                        isRegionSelectActive.current = true
                        activePointerId.current = e.pointerId

                        cameraElement.setPointerCapture(e.pointerId)

                        const [x, y] = pageSpaceToWorldSpace(pageX, pageY)

                        initialWorldPosition.current = { x, y }
                        initialPagePosition.current = { x: pageX, y: pageY }

                        if (e.shiftKey || e.ctrlKey) {
                            break
                        }

                        clearSelection()

                        break
                    }
                    case 1: {
                        const [x, y] = pageSpaceToWorldSpace(pageX, pageY)
                        console.log({ x, y })

                        break
                    }
                    case 2: {
                        // Initialize move
                        isPanActive.current = true
                        activePointerId.current = e.pointerId

                        cameraElement.setPointerCapture(e.pointerId)

                        initialPagePosition.current = { x: pageX, y: pageY }

                        const { x, y } = useStore.getState().camera.position
                        initialCameraPosition.current = { x, y }
                        break
                    }
                }

                break
            }
            case 'pen':
            case 'touch': {
                const { clientX, clientY, pageX, pageY } = e
                activeTouches.current.set(e.pointerId, { x: clientX, y: clientY })

                cameraElement.setPointerCapture(e.pointerId)

                if (activeTouches.current.size === 1) {
                    // Initialize motion
                    initialPagePosition.current = { x: pageX, y: pageY }
                    initialCameraPosition.current = { ...useStore.getState().camera.position }
                } else if (activeTouches.current.size === 2) {
                    // Initialize motion based on pinch
                    const pts = [...activeTouches.current.values()]
                    const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }

                    initialPagePosition.current = { x: mid.x, y: mid.y }
                    initialCameraPosition.current = { ...useStore.getState().camera.position }
                }

                break
            }
        }
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
        if (e.pointerType === 'mouse') {
            const { pageX, pageY } = e
            const [px, py] = pageSpaceToWorldSpace(pageX, pageY)
            rafBatcher.schedule('cursor-move',
                (state) => {
                    state.ui.cursor = { x: px, y: py }
                },
                (state) => {
                    state.callbacks?.onCursorMove?.(current(state))
                }
            )
        }

        switch (e.pointerType) {
            case 'mouse': {
                if (e.pointerId !== activePointerId.current) {
                    return
                }

                // Calculate pan
                const { pageX: currentScreenX, pageY: currentScreenY } = e
                const { x: initialScreenX, y: initialScreenY } = initialPagePosition.current

                const totalDeltaX = currentScreenX - initialScreenX
                const totalDeltaY = currentScreenY - initialScreenY

                const { x, y } = initialCameraPosition.current

                const dx = -totalDeltaX / zoom.current
                const dy = totalDeltaY / zoom.current

                if (isPanActive.current) {
                    // Continue panning
                    rafBatcher.schedule('camera-move',
                        (state) => {
                            state.camera.position = { x: x + dx, y: y + dy }
                        },
                        (state) => {
                            state.callbacks?.onCameraMove?.(current(state))
                        }
                    )
                    break
                }

                if (isRegionSelectActive.current) {
                    const d = distance([initialScreenX, initialScreenY], [currentScreenX, currentScreenY])

                    if (d > 15) {
                        // Initialize region select
                        const { x: ax, y: ay } = initialWorldPosition.current

                        const [bx, by] = pageSpaceToWorldSpace(currentScreenX, currentScreenY)

                        apply((state) => {
                            state.registry.selection.region = {
                                isActive: true,
                                pointerId: e.pointerId,
                                from: { x: ax, y: ay },
                                to: { x: bx, y: by },
                            }
                            state.ui.cursor = {
                                x: bx,
                                y: by
                            }

                            state.callbacks.onCursorMove?.(current(state))
                            state.callbacks.onSelectionRegionUpdated?.(current(state))
                        })

                        resetLocalState()
                        break
                    }

                    break
                }

                break
            }
            case 'pen':
            case 'touch': {
                const { clientX, clientY, pointerId } = e

                if (!activeTouches.current.has(pointerId)) {
                    return
                }

                activeTouches.current.set(pointerId, { x: clientX, y: clientY })

                const pts = [...activeTouches.current.values()]

                switch (pts.length) {
                    case 1: {
                        // Drag
                        const { pageX: currentScreenX, pageY: currentScreenY } = e
                        const { x: initialScreenX, y: initialScreenY } = initialPagePosition.current

                        const totalDeltaX = currentScreenX - initialScreenX
                        const totalDeltaY = currentScreenY - initialScreenY

                        const { x, y } = initialCameraPosition.current

                        const dx = -totalDeltaX / zoom.current
                        const dy = totalDeltaY / zoom.current

                        rafBatcher.schedule('camera-move',
                            (state) => {
                                state.camera.position = { x: x + dx, y: y + dy }
                            },
                            (state) => {
                                state.callbacks?.onCameraMove?.(current(state))
                            }
                        )
                        break
                    }
                    case 2: {
                        // Pinch
                        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
                        const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }

                        const { x: initialScreenX, y: initialScreenY } = initialPagePosition.current

                        const totalDeltaX = mid.x - initialScreenX
                        const totalDeltaY = mid.y - initialScreenY

                        const { x, y } = initialCameraPosition.current

                        const dx = -totalDeltaX / zoom.current
                        const dy = totalDeltaY / zoom.current

                        let nextZoom: number | null = null

                        if (previousPinch.current) {
                            const scaleDelta = dist / previousPinch.current.dist
                            nextZoom = clamp(zoom.current * scaleDelta, CAMERA.MINIMUM_ZOOM, CAMERA.MAXIMUM_ZOOM)
                        }

                        rafBatcher.schedule('camera-move',
                            (state) => {
                                state.camera.position = { x: x + dx, y: y + dy }
                                if (nextZoom !== null) {
                                    state.camera.zoom = nextZoom
                                }
                            },
                            (state) => {
                                state.callbacks?.onCameraMove?.(current(state))
                            }
                        )

                        previousPinch.current = { dist, mid }
                        break
                    }
                }
                break
            }
        }
    }

    const resetLocalState = useCallback(() => {
        activePointerId.current = undefined
        isPanActive.current = false
        isRegionSelectActive.current = false
    }, [])

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
        switch (e.pointerType) {
            case 'mouse': {
                if (e.pointerId !== activePointerId.current) {
                    return
                }

                resetLocalState()

                break
            }
            case 'pen':
            case 'touch': {
                const { pointerId, pageX, pageY } = e

                activeTouches.current.delete(pointerId);

                if (activeTouches.current.size < 2) {
                    previousPinch.current = null;
                }

                if (activeTouches.current.size === 1) {
                    // Reset position based on last pointer
                    const lastTouch = activeTouches.current.values().next().value

                    if (!lastTouch) {
                        break
                    }

                    initialPagePosition.current = { x: lastTouch.x, y: lastTouch.y }
                    initialCameraPosition.current = { ...useStore.getState().camera.position }
                }

                break
            }
        }

    }

    const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>): void => {
        switch (e.pointerType) {
            case 'mouse': {
                if (e.pointerId !== activePointerId.current) {
                    return
                }

                resetLocalState()

                break
            }
            case 'pen':
            case 'touch': {

            }
        }
    }

    const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>): void => {
        switch (e.pointerType) {
            case 'mouse': {
                resetLocalState()
                break
            }
            case 'pen':
            case 'touch': {
                activeTouches.current.clear()
                break
            }
        }
    }

    const handleWheel = (e: WheelEvent): void => {
        // e.stopPropagation()

        if (targetIsScrollable(e)) {
            return
        }

        e.preventDefault()

        if (useStore.getState().layout.fileUpload.isActive) {
            // Disable scroll zoom while drag-and-drop overlay is active.
            return
        }

        const { pageX, pageY, deltaY } = e

        // Calculate next zoom
        const isIncreasing = deltaY > 0
        const step = 0.1 * (isIncreasing ? -1 : 1)
        const nextZoom = clamp(zoom.current + step, CAMERA.MINIMUM_ZOOM, CAMERA.MAXIMUM_ZOOM)

        // Calculate next position, based on cursor position
        const [cursorWorldX, cursorWorldY] = pageSpaceToWorldSpace(pageX, pageY)
        const { x: cameraWorldX, y: cameraWorldY } = useStore.getState().camera.position

        const vec = {
            x: cursorWorldX - cameraWorldX,
            y: cursorWorldY - cameraWorldY * -1,
        }

        const zoomDelta = nextZoom - zoom.current

        const transform = {
            x: (vec.x / nextZoom) * zoomDelta,
            y: (vec.y / nextZoom) * -zoomDelta,
        }

        rafBatcher.schedule('camera-move',
            (state) => {
                state.camera.zoom = nextZoom
                state.camera.position = { x: cameraWorldX + transform.x, y: cameraWorldY + transform.y }
            },
            (state) => {
                state.callbacks?.onCameraMove?.(current(state))
            }
        )
    }

    useEffect(() => {
        const container = cameraControlOverlayRef.current

        if (!container) {
            return
        }

        container.addEventListener('wheel', handleWheel, { passive: false })

        return () => {
            container.removeEventListener('wheel', handleWheel)
        }
    }, [])

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.preventDefault()
    }

    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (lastPointerType.current !== 'mouse') {
            return
        }

        if (!isEditable) {
            return
        }

        switch (e.button) {
            case 0: {
                // Handle left mouse double click
                const { pageX, pageY } = e

                const [sx, sy] = pageSpaceToOverlaySpace(pageX, pageY)

                const [x, y] = pageSpaceToWorldSpace(pageX, pageY)

                apply((state) => {
                    state.ui.search = {
                        target: { x, y },
                        action: 'add-node',
                        actionId: ''
                    }
                    state.registry.contextMenus['add-node'] = {
                        position: { x: sx, y: sy },
                        context: {
                            type: 'add-node',
                        },
                    }
                })

                break
            }
            case 1: {
                // Handle center mouse button double click
                break
            }
            case 2: {
                // Handle right mouse button double click
                break
            }
        }
    }

    return (
        <div
            id="camera-control-overlay"
            className="np-w-full np-h-full np-pointer-events-auto np-touch-none"
            ref={cameraControlOverlayRef}
            onContextMenu={handleContextMenu}
            onDoubleClick={handleDoubleClick}
            onPointerDown={handlePointerDown}
            // onPointerDownCapture={handlePointerDownCapture}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onPointerCancel={handlePointerCancel}
        >
            {children}
        </div>
    )
}

export default React.memo(CameraOverlay)
