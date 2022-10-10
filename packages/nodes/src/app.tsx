import React, { useEffect, useLayoutEffect } from 'react'
import type { Document, NodeTemplate } from '@nodepen/core'
import '@/styles.css'
import { useDispatch, useStore } from '$'
import { ControlsContainer, GridContainer, PseudoShadowsContainer, NodesContainer } from '@/components'
import { CameraOverlay, useCameraProps } from './components/layout/camera'
import { SpeckleViewer } from './components/layout/speckle-viewer'

type NodesProps = {
  document: Document
  templates: NodeTemplate[]
  stream: {
    id: string
    objects: string[]
  }
  onChange?: () => void
}

export const NodesApp = ({ document, templates }: NodesProps): React.ReactElement => {
  const canvasRootRef = useStore((state) => state.registry.canvasRoot)

  const { setCameraPosition, loadTemplates } = useDispatch()

  useLayoutEffect(() => {
    const canvas = canvasRootRef.current

    if (!canvas) {
      return
    }

    const { width, height } = canvas.getBoundingClientRect()

    const offset = 25

    setCameraPosition(width / 2 + offset, height / -2 - offset)
  }, [])

  useEffect(() => {
    loadTemplates(templates ?? [])
  }, [templates])

  const cameraProps = useCameraProps()

  // TODO: Contextually disable pointer events on root svg (i.e. during pan)

  return (
    <div id="np-app-root" className="np-w-full np-h-full np-relative np-overflow-hidden" ref={canvasRootRef}>
      <Layer id="np-controls-layer" tab="static" z={90}>
        <ControlsContainer />
      </Layer>
      <Layer id="np-graph-canvas-layer" tab="graph" z={70}>
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
      <Layer id="np-grid-canvas-layer" tab="graph" z={20}>
        <GridContainer />
      </Layer>
      <PseudoShadowsContainer />
      <Layer id="np-model-layer" tab="model" z={10}>
        <SpeckleViewer />
      </Layer>
    </div>
  )
}

type LayerProps = {
  id: string
  tab: 'static' | 'graph' | 'model'
  z: number
  children?: React.ReactNode
}

const Layer = ({ id, tab, z, children }: LayerProps): React.ReactElement => {
  const activeTabConfiguration = useStore((store) => store.layout.tabs.configuration[store.layout.tabs.current])

  const layerTabConfiguration = useStore((store) => {
    switch (tab) {
      case 'static': {
        return { order: activeTabConfiguration.order }
      }
      default: {
        return store.layout.tabs.configuration[tab]
      }
    }
  })

  const activeTabDelta = layerTabConfiguration.order - activeTabConfiguration.order

  return (
    <div
      id={id}
      className="np-w-full np-h-full np-absolute np-pointer-events-none np-overflow-hidden"
      style={{
        zIndex: z,
        transition: 'transform',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        transform: `translateX(${activeTabDelta * 100}%)`,
      }}
    >
      {children}
    </div>
  )
}
