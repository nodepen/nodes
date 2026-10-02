import React, { useCallback } from 'react'
import { useDispatch, useStore } from '$'
import { Region } from './region'
import { KEYS } from '@/constants'
import { createPortal } from 'react-dom'
import { shallow } from 'zustand/shallow'
import Group from './group/Group'

/**
 * Renders SVG annotation elements meant to be drawn behind nodes in all cases.
 */
const AnnotationsUnderlayContainer = (): React.ReactElement => {
    const { apply } = useDispatch()

    const containerRef = useStore((state) => state.registry.annotations.underlayContainerRef)
    const wiresUnderlayContainerRef = useStore((state) => state.registry.wires.underlayContainerRef)

    const maskRef = useStore((state) => state.registry.wires.maskRef)

    const selectionRegionState = useStore((state) => state.registry.selection.region)

    const groupIds = useStore((state) => Object.keys(state.document.groups ?? {}), shallow)

    const setContainerRef = useCallback(
        (node: SVGGElement | null) => {
            containerRef.current = node
            apply((state) => {
                state.registry.annotations.underlayContainerReady = node !== null
            })
        },
        [apply, containerRef]
    )

    const setWiresUnderlayRef = useCallback(
        (node: SVGGElement | null) => {
            wiresUnderlayContainerRef.current = node
            apply((state) => {
                state.registry.wires.underlayContainerReady = node !== null
            })
        },
        [apply, wiresUnderlayContainerRef]
    )

    const setMaskRef = useCallback(
        (node: SVGMaskElement | null) => {
            maskRef.current = node
            apply((state) => {
                state.registry.wires.maskReady = node !== null
            })
        },
        [apply, maskRef]
    )

    return (
        <g id="np-annotations-underlay">
            <g ref={setContainerRef} />
            <g id="np-groups-underlay">
                {groupIds.map((groupId) => <Group key={`group-${groupId}`} id={groupId} />)}
            </g>
            <g id="np-regions-underlay">
                {selectionRegionState.isActive ? (
                    <Region isFill from={selectionRegionState.from} to={selectionRegionState.to} />
                ) : null}
            </g>
            <g id="np-wires-underlay" ref={setWiresUnderlayRef} />
            <mask id={KEYS.ELEMENT_IDS.WIRES_MASK_ID} ref={setMaskRef} />
        </g>
    )
}

type PortalProps = React.PropsWithChildren<{}>

export const AnnotationsUnderlayPortal = ({ children }: PortalProps) => {
    const containerRef = useStore((state) => state.registry.annotations.underlayContainerRef)
    const isReady = useStore((state) => state.registry.annotations.underlayContainerReady)

    if (!isReady || !containerRef.current) {
        return null
    }

    return createPortal(children, containerRef.current)
}

export default React.memo(AnnotationsUnderlayContainer)


