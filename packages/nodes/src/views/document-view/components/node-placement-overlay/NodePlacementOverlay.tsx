import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useStore } from '$'

const NodePlacementOverlay = () => {
    const overlayRef = useRef<HTMLDivElement>(null)

    const { apply } = useDispatch()
    const { isActive, activeNodeTemplate, activePointerId } = useStore((state) => state.layout.nodePlacement)

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
                activeNodeTemplate: null,
                activePointerId: null
            }
        })
    }, [])

    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        console.log(activeNodeTemplate)
        resetOverlayState()
    }, [activeNodeTemplate, resetOverlayState])

    return (
        <div
            ref={overlayRef}
            className={`${isActive ? 'np-pointer-events-auto' : 'np-pointer-events-none'} np-w-full np-h-full`}
            onPointerUp={handlePointerUp}
        />
    )
}

export default React.memo(NodePlacementOverlay)