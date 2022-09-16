import React, { useLayoutEffect } from 'react'
import type { Document } from '@nodepen/core'
import '@/styles.css'
import { COLORS } from '@/constants'
import { useDispatch, useStore } from '$'
import { AnnotationsContainer, ControlsContainer, GridContainer, NodesContainer } from '@/components'
import { CameraOverlay, useCameraProps } from './components/camera'

type NodesProps = {
  document: Document
  onChange?: () => void
}

export const NodesApp = ({ document }: NodesProps): React.ReactElement => {
  const canvasRootRef = useStore((state) => state.registry.canvasRoot)

  const { setCameraPosition } = useDispatch()

  useLayoutEffect(() => {
    const canvas = canvasRootRef.current

    if (!canvas) {
      return
    }

    const { width, height } = canvas.getBoundingClientRect()

    const offset = 25

    setCameraPosition(width / 2 + offset, height / -2 - offset)
  }, [])

  const cameraProps = useCameraProps()

  // TODO: Contextually disable pointer events on root svg (i.e. during pan)

  return (
    <div id="np-app-root" className="np-w-full np-h-full np-relative np-overflow-hidden" ref={canvasRootRef}>
      <Layer id="np-controls-layer" z={90}>
        <ControlsContainer />
      </Layer>
      <Layer id="np-graph-canvas-layer" z={70}>
        <CameraOverlay>
          <svg {...cameraProps} className="np-overflow-visible np-pointer-events-none np-rounded-md">
            <NodesContainer />
            {/* XY Axis */}
            {/* <line
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
            /> */}
          </svg>
        </CameraOverlay>
      </Layer>
      <Layer id="np-shadow-layer" z={30}></Layer>
      <Layer id="np-grid-canvas-layer" z={20}>
        <GridContainer />
      </Layer>
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
