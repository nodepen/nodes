import React, { useEffect } from 'react'
import { useStore, useDispatch } from '$'
import { Layer } from '../common'
import { useViewRegistry } from '../common/hooks'
import { CameraOverlay, ContextMenuContainer, GridContainer, NodePlacementOverlay } from './components'
import { useCameraProps } from './hooks'
import { AnnotationsContainer, NodesContainer } from '@/components'

type DocumentViewProps = {
  editable: boolean
}

const DocumentView = ({ editable }: DocumentViewProps): React.ReactElement | null => {
  const canvasRootRef = useStore((state) => state.registry.canvasRoot)
  const cameraProps = useCameraProps()

  const { setCameraPosition } = useDispatch()

  const { viewPosition } = useViewRegistry({ key: 'document', label: 'Document' })

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

  if (viewPosition === null) {
    return <></>
  }

  return (
    <>
      <Layer id="np-node-placement-overlay-layer" position={viewPosition} z={91}>
        <NodePlacementOverlay />
      </Layer>
      <Layer id="np-context-menu-layer" position={viewPosition} z={90}>
        <ContextMenuContainer />
      </Layer>
      <Layer id="np-graph-canvas-layer" position={viewPosition} z={70}>
        <CameraOverlay>
          <svg {...cameraProps} className="np-overflow-visible np-pointer-events-none">
            <AnnotationsContainer />
            <NodesContainer />
          </svg>
        </CameraOverlay>
      </Layer>
      <Layer id="np-grid-canvas-layer" position={viewPosition} z={20}>
        <GridContainer />
      </Layer>
    </>
  )
}

export default React.memo(DocumentView)
