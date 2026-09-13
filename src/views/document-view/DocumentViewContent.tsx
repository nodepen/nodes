import React from 'react'
import { useCameraProps, useGlobalHotkeys } from './hooks'
import { CameraOverlay } from './layers'
import { AnnotationsOverlayContainer, AnnotationsUnderlayContainer, NodesContainer } from '@/components'

const DocumentViewCanvas = React.memo(function DocumentViewCanvas() {
    const { extents: _extents, ...cameraProps } = useCameraProps()

    return (
        <svg {...cameraProps} className="np-overflow-hidden np-pointer-events-none">
            <AnnotationsUnderlayContainer />
            <NodesContainer />
            <AnnotationsOverlayContainer />
        </svg>
    )
})

export const DocumentViewContent = () => {
    useGlobalHotkeys()

    return (
        <CameraOverlay>
            <DocumentViewCanvas />
        </CameraOverlay>
    )
}
