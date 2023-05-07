import React, { useEffect, useRef } from 'react'
import { useDispatch, useStore } from '$'
import { Region } from './region'

/**
 * Renders SVG annotation elements meant to be drawn behind nodes in all cases.
 */
const AnnotationUnderlayContainer = (): React.ReactElement => {
  const ref = useRef<SVGGElement>(null)

  const { apply } = useDispatch()

  useEffect(() => {
    apply((state) => {
      state.registry.wires.containerRef = ref
    })
  }, [])

  const selectionRegionState = useStore((state) => state.registry.selection.region)

  return (
    <g id="np-annotations-underlay">
      <g id="np-wires-underlay" ref={ref} />
      <g id="np-regions-underlay">
        {selectionRegionState.isActive ? (
          <Region isFill from={selectionRegionState.from} to={selectionRegionState.to} />
        ) : null}
      </g>
    </g>
  )
}

export default React.memo(AnnotationUnderlayContainer)
