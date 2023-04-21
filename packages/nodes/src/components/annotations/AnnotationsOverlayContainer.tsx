import React from 'react'
import { useStore } from '$'
import { Region } from './region'

const AnnotationsOverlayContainer = () => {
  const selectionRegionState = useStore((state) => state.registry.selection.region)

  return (
    <g id="np-annotations-overlay">
      <g id="np-regions-overlay">
        {selectionRegionState.isActive ? (
          <Region isBorder from={selectionRegionState.from} to={selectionRegionState.to} />
        ) : null}
      </g>
    </g>
  )
}

export default React.memo(AnnotationsOverlayContainer)
