import React, { useEffect } from 'react'
import { useStore, useDispatch } from '$'
import { Layer } from '../common'
import { TransientElementOverlay, CanvasGridUnderlay, NodePlacementOverlay, SelectionRegionOverlay } from './layers'
import { DocumentViewContent } from './DocumentViewContent'
import { PresenceOverlay } from './layers/presence-overlay'
import { useFlag } from '@/hooks/useFlag'

const DocumentView = (): React.ReactElement | null => {
    const canvasRootRef = useStore((state) => state.registry.canvasRoot)

    const { setCameraPosition } = useDispatch()

    useEffect(() => {
        const canvas = canvasRootRef.current

        if (!canvas) {
            return
        }

        const { x, y } = useStore.getState().camera.position

        if (x !== 0 || y !== 0) {
            // Do not reset camera if it has already been moved
            return
        }

        const { width, height } = canvas.getBoundingClientRect()

        const offset = 25

        setCameraPosition(width / 2 + offset, height / -2 - offset)
    }, [])

    return (
        <>
            <Layer id="np-transient-element-overlay-layer" z={90}>
                <TransientElementOverlay />
            </Layer>
            <Layer id="np-presence-layer" z={85}>
                <PresenceOverlay />
            </Layer>
            <Layer id="np-node-placement-overlay-layer" z={80}>
                <NodePlacementOverlay />
            </Layer>
            <Layer id="np-selection-region-overlay-layer" z={80}>
                <SelectionRegionOverlay />
            </Layer>
            <Layer id="np-document-view-content-layer" z={70}>
                <DocumentViewContent />
            </Layer>
            <Layer id="np-grid-canvas-layer" z={20}>
                <CanvasGridUnderlay />
            </Layer>
        </>
    )
}

export default React.memo(DocumentView)
