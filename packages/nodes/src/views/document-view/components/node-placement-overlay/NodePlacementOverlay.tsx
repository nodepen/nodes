import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useStore } from '$'
import { usePageSpaceToWorldSpace } from '@/hooks'

const NodePlacementOverlay = () => {
    const overlayRef = useRef<HTMLDivElement>(null)

    const { apply } = useDispatch()
    const { isActive, activeNodeId, activePointerId } = useStore((state) => state.layout.nodePlacement)

    const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

    useEffect(() => {
        const element = overlayRef.current

        if (!isActive || !element || !activePointerId) {
            return
        }

        element.setPointerCapture(activePointerId)
    }, [isActive])

    const resetOverlayState = useCallback(() => {
        apply((state) => {
            state.layout.nodePlacement = {
                isActive: false,
                activeNodeId: null,
                activePointerId: null
            }
        })
    }, [])

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isActive || !activeNodeId) {
            return
        }

        const { pageX, pageY } = e

        const [x, y] = pageSpaceToWorldSpace(pageX, pageY)

        apply((state) => {
            state.document.nodes[activeNodeId].position = { x, y }
        })
    }, [activeNodeId])

    const handlePointerUp = useCallback((_e: React.PointerEvent<HTMLDivElement>) => {
        if (!activeNodeId) {
            return
        }

        apply((state) => {
            state.document.nodes[activeNodeId].status.isProvisional = false
        })

        resetOverlayState()
    }, [activeNodeId, resetOverlayState])

    return (
        <div
            ref={overlayRef}
            className={`${isActive ? 'np-pointer-events-auto' : 'np-pointer-events-none'} np-w-full np-h-full`}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        />
    )
}

export default React.memo(NodePlacementOverlay)