import React from 'react'
import { useCameraProps } from './hooks'
import { CameraOverlay } from './layers'
import { AnnotationsContainer, NodesContainer } from '@/components'

export const DocumentViewContent = () => {
  const cameraProps = useCameraProps()

  return (
    <CameraOverlay>
      <svg {...cameraProps} className="np-overflow-visible np-pointer-events-none">
        <AnnotationsContainer />
        <NodesContainer />
      </svg>
    </CameraOverlay>
  )
}
