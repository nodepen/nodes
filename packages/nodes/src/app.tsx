import React from 'react'
import type { Document } from '@nodepen/core'
import '@/styles.css'
import { COLORS } from '@/constants'
import { useStore } from '$'
import { AnnotationsContainer, ControlsContainer, NodesContainer } from '@/components'
import { CameraOverlay, useCameraProps } from './components/camera'

type NodesProps = {
  document: Document
  onChange?: () => void
}

export const NodesApp = ({ document }: NodesProps): React.ReactElement => {
  const canvasRootRef = useStore((state) => state.registry.canvasRoot)

  const cameraProps = useCameraProps()

  // TODO: Contextually disable pointer events on root svg (i.e. during pan)

  return (
    <div id="np-app-root" className="np-w-full np-h-full np-relative np-overflow-visible" ref={canvasRootRef}>
      <Layer id="np-controls-layer" z={90}>
        <ControlsContainer />
      </Layer>
      <Layer id="np-graph-canvas-layer" z={70}>
        <CameraOverlay>
          <svg {...cameraProps} className="np-overflow-visible np-pointer-events-none np-bg-pale np-rounded-md">
            <AnnotationsContainer />
            <NodesContainer />
            <line
              x1={0}
              y1={0}
              x2={250}
              y2={0}
              stroke={COLORS.DARK}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-250}
              stroke={COLORS.DARK}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </CameraOverlay>
      </Layer>
      <Layer id="np-grid-canvas-layer" z={20}></Layer>
    </div>
  )
}

type LayerProps = {
  id: string
  z: number
  children?: React.ReactNode
}

const Layer = ({ id, z, children }: LayerProps): React.ReactElement => {
  return (
    <div id={id} className="np-w-full np-h-full np-absolute np-pointer-events-none" style={{ zIndex: z }}>
      {children}
    </div>
  )
}
