import React, { useEffect, useLayoutEffect } from 'react'
import type * as NodePen from '@nodepen/core'
import '@/styles.css'
import { useDispatch, useStore } from '$'
import { ControlsContainer, GridContainer, PseudoShadowsContainer, NodesContainer } from '@/components'
import { CameraOverlay, useCameraProps } from './components/layout/camera'
import { SpeckleViewer } from './components/layout/speckle-viewer'
import { Layer } from './views/common'

type NodesProps = {
  document: NodePen.Document
  templates: NodePen.NodeTemplate[]

  // stream: {
  //   id: string
  //   objectIds: string[]
  // }
  onChange?: (document: NodePen.Document) => void
  children: React.ReactNode
}

export const NodesApp = ({ document, templates, children, ...callbacks }: NodesProps): React.ReactElement => {
  const { loadTemplates } = useDispatch()

  // useEffect(() => {
  //   if (!onChange) {
  //     return
  //   }

  //   apply((state) => {
  //     state.callbacks.onChange = onChange
  //   })
  // }, [onChange])

  useEffect(() => {
    loadTemplates(templates ?? [])
  }, [templates])

  // const internalDocument = useStore((state) => state.document)
  // const onDocumentChange = useStore((state) => state.callbacks.onChange)

  // useEffect(() => {
  //   // TODO: Be smarter about diffing this
  //   onDocumentChange(internalDocument)
  // }, [internalDocument])

  // useEffect(() => {
  //   apply((state) => {
  //     state.stream = stream
  //   })
  // }, [stream.objectIds])

  // TODO: Contextually disable pointer events on root svg (i.e. during pan)

  return <NodesAppInternal>{children}</NodesAppInternal>

  // return (
  //   <div id="np-app-root" className="np-w-full np-h-full np-relative np-overflow-hidden" ref={canvasRootRef}>
  //     <Layer fixed tab="graph" id="np-controls-layer" z={90}>
  //       <ControlsContainer />
  //     </Layer>
  //     <Layer id="np-graph-canvas-layer" tab="graph" z={70}>
  //       <CameraOverlay>
  //         <svg {...cameraProps} className="np-overflow-visible np-pointer-events-none np-rounded-md">
  //           <NodesContainer />
  //           {/* XY Axis */}
  //           {/* <line
  //             x1={0}
  //             y1={0}
  //             x2={250}
  //             y2={0}
  //             stroke={COLORS.DARK}
  //             strokeWidth={2}
  //             vectorEffect="non-scaling-stroke"
  //           />
  //           <line
  //             x1={0}
  //             y1={0}
  //             x2={0}
  //             y2={-250}
  //             stroke={COLORS.DARK}
  //             strokeWidth={2}
  //             vectorEffect="non-scaling-stroke"
  //           /> */}
  //         </svg>
  //       </CameraOverlay>
  //     </Layer>
  //     <Layer id="np-grid-canvas-layer" tab="graph" z={20}>
  //       <GridContainer />
  //     </Layer>
  //     <PseudoShadowsContainer />
  //   </div>
  // )
}

type NodesAppInternalProps = {
  children: React.ReactNode
}

const NodesAppInternal = React.memo(({ children }: NodesAppInternalProps) => {
  const canvasRootRef = useStore((state) => state.registry.canvasRoot)

  return (
    <div id="np-app-root" className="np-w-full np-h-full np-relative np-overflow-hidden" ref={canvasRootRef}>
      <Layer fixed id="np-controls-layer" z={90}>
        <ControlsContainer />
      </Layer>
      <PseudoShadowsContainer />
      {children}
    </div>
  )
})
