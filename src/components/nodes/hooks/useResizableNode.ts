import React, { useCallback, useEffect, useMemo, useRef } from "react"
import type * as NodePen from '@/types'
import { useCallbacks, useDispatch, useStore, useStoreRef } from "$"
import { clamp } from "@/utils"
import { saveDocument } from "@/store/utils/saveDocument"

type ResizeConfig = {
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    computeAnchors?: (node: NodePen.DocumentNode) => NodePen.DocumentNode['anchors']
}

export const useResizableNode = (nodeInstanceId: string, config?: ResizeConfig) => {
    const {
        minHeight = 40,
        maxHeight = 500,
        minWidth = 60,
        maxWidth = 500,
        computeAnchors
    } = config ?? {}

    const handles = useMemo(() => ({
        topRight: React.createRef<SVGGElement>(),
        topLeft: React.createRef<SVGGElement>(),
        bottomLeft: React.createRef<SVGGElement>(),
        bottomRight: React.createRef<SVGGElement>(),
        top: React.createRef<SVGGElement>(),
        left: React.createRef<SVGGElement>(),
        bottom: React.createRef<SVGGElement>(),
        right: React.createRef<SVGGElement>(),
    }), [])

    const getCursor = useCallback((type: keyof typeof handles) => {
        const cursorsByType: Record<keyof typeof handles, string> = {
            topRight: 'ne-resize',
            topLeft: 'nw-resize',
            bottomLeft: 'sw-resize',
            bottomRight: 'se-resize',
            top: 'n-resize',
            left: 'w-resize',
            bottom: 's-resize',
            right: 'e-resize',
        }

        return cursorsByType[type]
    }, [])

    const { apply, clearSelection } = useDispatch()
    const { onSaveDocument } = useCallbacks()

    const zoom = useStoreRef((state) => state.camera.zoom)

    const isResizing = useRef(false)
    const activePointerId = useRef<number>(-1)
    const activeHandleType = useRef<keyof typeof handles>('topLeft')

    const initialPointerPosition = useRef<{ pageX: number, pageY: number }>({ pageX: 0, pageY: 0 })
    const initialNodePosition = useRef<{ x: number, y: number }>({ x: 0, y: 0 })
    const initialNodeDimensions = useRef<{ width: number, height: number }>({ width: 0, height: 0 })

    const maxDx = useRef(0)
    const minDx = useRef(0)
    const maxDy = useRef(0)
    const minDy = useRef(0)

    const setDocumentCursor = useCallback((type: keyof typeof handles) => {
        document.body.style.cursor = getCursor(type)
    }, [])

    const resetDocumentCursor = useCallback(() => {
        document.body.style.cursor = 'auto'
    }, [])

    const handlePointerEnter = useCallback((_e: PointerEvent, type: keyof typeof handles) => {
        setDocumentCursor(type)
    }, [setDocumentCursor])

    const handlePointerLeave = useCallback((_e: PointerEvent, _type: keyof typeof handles) => {
        resetDocumentCursor()
    }, [resetDocumentCursor])

    const handlePointerDown = useCallback((e: PointerEvent, type: keyof typeof handles) => {
        const { pageX, pageY } = e

        if (isResizing.current) {
            return
        }

        const el = handles[type].current
        const node = useStore.getState().document.nodes[nodeInstanceId]

        if (!el || !node) {
            return
        }

        e.stopPropagation()
        clearSelection()

        el.setPointerCapture(e.pointerId)

        setDocumentCursor(type)

        isResizing.current = true
        activePointerId.current = e.pointerId
        activeHandleType.current = type
        initialPointerPosition.current = { pageX, pageY }
        initialNodePosition.current = node.position
        initialNodeDimensions.current = node.dimensions

        switch (type) {
            case 'topRight': {
                maxDx.current = maxWidth - node.dimensions.width
                minDx.current = minWidth - node.dimensions.width
                maxDy.current = node.dimensions.height - minHeight
                minDy.current = node.dimensions.height - maxHeight
                break
            }
            case 'top': {
                maxDx.current = 0
                minDx.current = 0
                maxDy.current = node.dimensions.height - minHeight
                minDy.current = node.dimensions.height - maxHeight
                break
            }
            case 'topLeft': {
                maxDx.current = (minWidth - node.dimensions.width) * -1
                minDx.current = (maxWidth - node.dimensions.width) * -1
                maxDy.current = node.dimensions.height - minHeight
                minDy.current = node.dimensions.height - maxHeight
                break
            }
            case 'left': {
                maxDx.current = (minWidth - node.dimensions.width) * -1
                minDx.current = (maxWidth - node.dimensions.width) * -1
                maxDy.current = 0
                minDy.current = 0
                break
            }
            case 'bottomLeft': {
                maxDx.current = (minWidth - node.dimensions.width) * -1
                minDx.current = (maxWidth - node.dimensions.width) * -1
                maxDy.current = maxHeight - node.dimensions.height
                minDy.current = minHeight - node.dimensions.height
                break
            }
            case 'bottom': {
                maxDx.current = 0
                minDx.current = 0
                maxDy.current = maxHeight - node.dimensions.height
                minDy.current = minHeight - node.dimensions.height
                break
            }
            case 'bottomRight': {
                maxDx.current = maxWidth - node.dimensions.width
                minDx.current = minWidth - node.dimensions.width
                maxDy.current = maxHeight - node.dimensions.height
                minDy.current = minHeight - node.dimensions.height
                break
            }
            case 'right': {
                maxDx.current = maxWidth - node.dimensions.width
                minDx.current = minWidth - node.dimensions.width
                maxDy.current = 0
                minDy.current = 0
                break
            }
        }

    }, [setDocumentCursor])

    const handlePointerMove = useCallback((e: PointerEvent, type: keyof typeof handles) => {
        const { pageX: currentPointerX, pageY: currentPointerY, pointerId } = e

        if (!isResizing.current || pointerId !== activePointerId.current || type !== activeHandleType.current) {
            return
        }

        const { pageX: initialPointerX, pageY: initialPointerY } = initialPointerPosition.current

        const dx = clamp((currentPointerX - initialPointerX) / zoom.current, minDx.current, maxDx.current)
        const dy = clamp((currentPointerY - initialPointerY) / zoom.current, minDy.current, maxDy.current)

        const { x: initialNodeX, y: initialNodeY } = initialNodePosition.current
        const { width: initialNodeWidth, height: initialNodeHeight } = initialNodeDimensions.current

        const next = {
            x: initialNodeX,
            y: initialNodeY,
            width: initialNodeWidth,
            height: initialNodeHeight
        }

        switch (activeHandleType.current) {
            case 'topRight': {
                next.x = initialNodeX
                next.y = initialNodeY + dy
                next.width = initialNodeWidth + dx
                next.height = initialNodeHeight + (dy * -1)
                break
            }
            case 'top': {
                next.x = initialNodeX
                next.y = initialNodeY + dy
                next.width = initialNodeWidth + dx
                next.height = initialNodeHeight + (dy * -1)
                break
            }
            case 'topLeft': {
                next.x = initialNodeX + dx
                next.y = initialNodeY + dy
                next.width = initialNodeWidth + (dx * -1)
                next.height = initialNodeHeight + (dy * -1)
                break
            }
            case 'left': {
                next.x = initialNodeX + dx
                next.y = initialNodeY + dy
                next.width = initialNodeWidth + (dx * -1)
                next.height = initialNodeHeight
                break
            }
            case 'bottomLeft': {
                next.x = initialNodeX + dx
                next.y = initialNodeY
                next.width = initialNodeWidth + (dx * -1)
                next.height = initialNodeHeight + dy
                break
            }
            case 'bottom': {
                next.x = initialNodeX
                next.y = initialNodeY
                next.width = initialNodeWidth
                next.height = initialNodeHeight + dy
                break
            }
            case 'bottomRight': {
                next.x = initialNodeX
                next.y = initialNodeY
                next.width = initialNodeWidth + dx
                next.height = initialNodeHeight + dy
                break
            }
            case 'right': {
                next.x = initialNodeX
                next.y = initialNodeY
                next.width = initialNodeWidth + dx
                next.height = initialNodeHeight
                break
            }
            default: {
                return
            }
        }

        apply((state) => {
            state.document.nodes[nodeInstanceId].position = {
                x: next.x,
                y: next.y
            }
            state.document.nodes[nodeInstanceId].dimensions = {
                width: next.width,
                height: next.height
            }
            state.document.nodes[nodeInstanceId].anchors = {
                ...state.document.nodes[nodeInstanceId].anchors,
                ...computeAnchors?.(state.document.nodes[nodeInstanceId])
            }
        })
    }, [])

    const resetInternalState = useCallback(() => {
        isResizing.current = false
        activePointerId.current = -1
        resetDocumentCursor()
    }, [resetDocumentCursor, onSaveDocument])

    const handlePointerUp = useCallback((e: PointerEvent, type: keyof typeof handles) => {
        resetInternalState()
    }, [resetInternalState])

    const handlePointerCancel = useCallback((e: PointerEvent, type: keyof typeof handles) => {
        resetInternalState()
    }, [resetInternalState])

    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller

        for (const [key, ref] of Object.entries(handles)) {
            const type = key as keyof typeof handles

            ref.current?.addEventListener('pointerenter', (e) => handlePointerEnter(e, type), { signal })
            ref.current?.addEventListener('pointerleave', (e) => handlePointerLeave(e, type), { signal })
            ref.current?.addEventListener('pointerdown', (e) => handlePointerDown(e, type), { signal })
            ref.current?.addEventListener('pointermove', (e) => handlePointerMove(e, type), { signal })
            ref.current?.addEventListener('pointerup', (e) => handlePointerUp(e, type), { signal })
            ref.current?.addEventListener('pointercancel', (e) => handlePointerCancel(e, type), { signal })
        }

        return () => {
            controller.abort()
        }
    }, [handles, handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel])

    return handles
}