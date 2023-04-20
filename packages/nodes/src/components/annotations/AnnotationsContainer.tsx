import React, { useEffect, useRef } from 'react'
import { useDispatch, useStore } from '$'
import { Region } from './region'

const AnnotationContainer = (): React.ReactElement => {
  const ref = useRef<SVGGElement>(null)

  const { apply } = useDispatch()

  useEffect(() => {
    apply((state) => {
      state.registry.wires.containerRef = ref
    })
  }, [])

  const selectionRegionState = useStore((state) => state.registry.selection.region)

  console.log(selectionRegionState.isActive)

  return (
    <g id="np-annotations">
      <g id="np-wires" ref={ref} />
      <g id="np-regions">
        {selectionRegionState.isActive ? (
          <Region from={selectionRegionState.from} to={selectionRegionState.to} />
        ) : null}
      </g>
    </g>
  )
}

export default React.memo(AnnotationContainer)
