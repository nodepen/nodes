import React, { useEffect } from 'react'
import { useStore, useDispatch } from '$'
import { Layer } from '../common'
import { useViewRegistry } from '../common/hooks'
import { TransientElementOverlay, CanvasGridUnderlay, NodePlacementOverlay, SelectionRegionOverlay } from './layers'
import { DocumentViewContent } from './DocumentViewContent'

type DocumentViewProps = {
  editable: boolean
}

const DocumentView = ({ editable: _e }: DocumentViewProps): React.ReactElement | null => {
  const canvasRootRef = useStore((state) => state.registry.canvasRoot)

  const { setCameraPosition } = useDispatch()

  const [position, width] = useViewRegistry({ key: 'document', label: 'Document' })

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
      <Layer id="np-node-placement-overlay-layer" crop position={position} width={width} z={95}>
        <NodePlacementOverlay />
      </Layer>
      <Layer id="np-selection-region-overlay-layer" crop position={position} width={width} z={95}>
        <SelectionRegionOverlay />
      </Layer>
      <Layer id="np-transient-element-overlay-layer" crop position={position} width={width} z={90} fixed>
        <TransientElementOverlay />
      </Layer>
      <Layer id="np-document-view-content-layer" crop position={position} width={width} z={70}>
        <DocumentViewContent />
      </Layer>
      <Layer id="np-grid-canvas-layer" crop position={position} width={width} z={20}>
        <CanvasGridUnderlay />
      </Layer>
    </>
  )
}

export default React.memo(DocumentView)
