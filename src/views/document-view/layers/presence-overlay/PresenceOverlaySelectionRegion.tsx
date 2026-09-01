import { AnnotationsOverlayPortal, AnnotationsUnderlayPortal } from '@/components/annotations'
import { Region } from '@/components/annotations/region'
import { lerpPoint2d, useInterpolatedState } from '@/hooks/useInterpolatedState'
import { useStore, useStoreRef } from '@/store'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    sessionId: string
}

const PresenceOverlaySelectionRegion = ({ sessionId }: Props) => {
    const sessionData = useStoreRef((state) => state.presence.sessions[sessionId])

    const region = useStore((state) => state.presence.selectionRegions[sessionId] ?? null)
    const previousRegion = useRef<typeof region>(null)

    const [target, setTarget] = useInterpolatedState(region?.to ?? { x: 0, y: 0 }, lerpPoint2d)

    useEffect(() => {
        if (!region) {
            previousRegion.current = null
            return
        }

        setTarget(region.to, { immediate: previousRegion.current === null })

        previousRegion.current = region
    }, [region])

    if (!region) return null

    const isDashed = region.from.x > target.x

    return <>
        <AnnotationsOverlayPortal>
            <Region from={region.from} to={target} isFill={false} isBorder={true} isDashed={isDashed} borderColor={sessionData.current.color} />
        </AnnotationsOverlayPortal>
        <AnnotationsUnderlayPortal>
            <Region from={region.from} to={target} isFill={true} />
        </AnnotationsUnderlayPortal>
    </>
}

export default React.memo(PresenceOverlaySelectionRegion)