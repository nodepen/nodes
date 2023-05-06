import React, { useEffect, useRef } from 'react'
import { useDispatch, useStore } from '$'
import { Region } from './region'
import { LiveConnectionWire } from './wire'
import { useLiveWireCursor } from './wire/hooks'

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

  const liveWires = useStore((state) => Object.entries(state.registry.wires.live.connections))
  useLiveWireCursor(liveWires.map(([_key, connection]) => connection.portAnchor))

  const selectionRegionState = useStore((state) => state.registry.selection.region)

  return (
    <g id="np-annotations-underlay">
      <g id="np-wires-underlay" ref={ref}>
        {liveWires.map(([liveWireKey, liveWire]) => (
          <LiveConnectionWire
            key={`live-wire-${liveWireKey}`}
            portAnchor={liveWire.portAnchor}
            portAnchorType={liveWire.portAnchorType}
          />
        ))}
      </g>
      <g id="np-regions-underlay">
        {selectionRegionState.isActive ? (
          <Region isFill from={selectionRegionState.from} to={selectionRegionState.to} />
        ) : null}
      </g>
    </g>
  )
}

export default React.memo(AnnotationUnderlayContainer)
