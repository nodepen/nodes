import React, { useEffect, useRef } from 'react'
import { useDispatch } from '$'

const AnnotationContainer = (): React.ReactElement => {
  const ref = useRef<SVGGElement>(null)

  const { apply } = useDispatch()

  useEffect(() => {
    apply((state) => {
      state.registry.wires.containerRef = ref
    })
  }, [])

  return (
    <g id="np-annotations">
      <g id="np-wires" ref={ref} />
    </g>
  )
}

export default React.memo(AnnotationContainer)
