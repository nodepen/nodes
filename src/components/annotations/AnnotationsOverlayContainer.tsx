import React, { useCallback } from 'react'
import { useDispatch, useStore } from '$'
import { Region } from './region'
import { LiveConnectionWire } from './wire'
import { useLiveWireCursor } from './wire/hooks'
import { createPortal } from 'react-dom'

const AnnotationsOverlayContainer = () => {
    const { apply } = useDispatch()

    const containerRef = useStore((state) => state.registry.annotations.overlayContainerRef)

    const selectionRegionState = useStore((state) => state.registry.selection.region)
    const isDashed = selectionRegionState.isActive ? selectionRegionState.from.x > selectionRegionState.to.x : false

    const liveWires = useStore((state) => Object.entries(state.registry.wires.live.connections))
    useLiveWireCursor(liveWires.map(([_key, connection]) => connection.portAnchor))

    const setContainerRef = useCallback(
        (node: SVGGElement | null) => {
            containerRef.current = node
            apply((state) => {
                state.registry.annotations.overlayContainerReady = node !== null
            })
        },
        [apply, containerRef]
    )

    return (
        <g id="np-annotations-overlay" ref={setContainerRef}>
            <g id="np-wires-overlay">
                {liveWires.map(([liveWireKey, liveWire]) => (
                    <LiveConnectionWire
                        key={`live-wire-${liveWireKey}`}
                        portAnchor={liveWire.portAnchor}
                        portAnchorType={liveWire.portAnchorType}
                    />
                ))}
            </g>
            <g id="np-regions-overlay">
                {selectionRegionState.isActive ? (
                    <Region isBorder isDashed={isDashed} from={selectionRegionState.from} to={selectionRegionState.to} />
                ) : null}
            </g>
        </g>
    )
}

type PortalProps = React.PropsWithChildren<{}>

export const AnnotationsOverlayPortal = ({ children }: PortalProps) => {
    const containerRef = useStore((state) => state.registry.annotations.overlayContainerRef)
    const isReady = useStore((state) => state.registry.annotations.overlayContainerReady)

    if (!isReady || !containerRef.current) {
        return null
    }

    return createPortal(children, containerRef.current)
}

export default React.memo(AnnotationsOverlayContainer)
