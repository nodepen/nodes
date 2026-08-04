import React from 'react'
import { useStore } from '$'
import { Region } from './region'
import { KEYS } from '@/constants'
import { createPortal } from 'react-dom'

/**
 * Renders SVG annotation elements meant to be drawn behind nodes in all cases.
 */
const AnnotationsUnderlayContainer = (): React.ReactElement => {
    const containerRef = useStore((state) => state.registry.annotations.underlayContainerRef)
    const wiresUnderlayContainerRef = useStore((state) => state.registry.wires.underlayContainerRef)

    const maskRef = useStore((state) => state.registry.wires.maskRef)

    const selectionRegionState = useStore((state) => state.registry.selection.region)

    return (
        <g id="np-annotations-underlay" ref={containerRef}>
            <g id="np-regions-underlay">
                {selectionRegionState.isActive ? (
                    <Region isFill from={selectionRegionState.from} to={selectionRegionState.to} />
                ) : null}
            </g>
            <g id="np-wires-underlay" ref={wiresUnderlayContainerRef} />
            <mask id={KEYS.ELEMENT_IDS.WIRES_MASK_ID} ref={maskRef} />
        </g>
    )
}

type PortalProps = React.PropsWithChildren<{}>

export const AnnotationsUnderlayPortal = ({ children }: PortalProps) => {
    const containerRef = useStore((state) => state.registry.annotations.underlayContainerRef)

    if (!containerRef || !containerRef.current) {
        return null
    }

    return createPortal(children, containerRef.current)
}

export default React.memo(AnnotationsUnderlayContainer)


