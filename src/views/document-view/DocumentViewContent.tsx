import React from 'react'
import { useCameraProps, useGlobalHotkeys } from './hooks'
import { CameraOverlay } from './layers'
import { AnnotationsOverlayContainer, AnnotationsUnderlayContainer, NodesContainer } from '@/components'

export const DocumentViewContent = () => {
  const cameraProps = useCameraProps()

  useGlobalHotkeys()

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
