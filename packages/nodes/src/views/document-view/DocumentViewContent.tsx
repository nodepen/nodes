import React from 'react'
import { useCameraProps } from './hooks'
import { CameraOverlay } from './layers'
import { AnnotationsOverlayContainer, AnnotationsUnderlayContainer, NodesContainer } from '@/components'

export const DocumentViewContent = () => {
  const cameraProps = useCameraProps()

  return (
    <CameraOverlay>
      <svg {...cameraProps} className="np-overflow-visible np-pointer-events-none">
        <AnnotationsUnderlayContainer />
        <NodesContainer />
        <AnnotationsOverlayContainer />
      </svg>
    </CameraOverlay>
  )
}
