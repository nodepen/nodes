import React from 'react'
import { useStore } from '$'
import { Region } from './region'
import { KEYS } from '@/constants'

/**
 * Renders SVG annotation elements meant to be drawn behind nodes in all cases.
 */
const AnnotationUnderlayContainer = (): React.ReactElement => {
  const underlayContainerRef = useStore((state) => state.registry.wires.underlayContainerRef)
  const maskRef = useStore((state) => state.registry.wires.maskRef)

  const selectionRegionState = useStore((state) => state.registry.selection.region)

  return (
    <g id="np-annotations-underlay">
      <g id="np-regions-underlay">
        {selectionRegionState.isActive ? (
          <Region isFill from={selectionRegionState.from} to={selectionRegionState.to} />
        ) : null}
      </g>
      <g id="np-wires-underlay" ref={underlayContainerRef} />
      <mask id={KEYS.ELEMENT_IDS.WIRES_MASK_ID} ref={maskRef} />
    </g>
  )
}

export default React.memo(AnnotationUnderlayContainer)
