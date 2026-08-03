import React, { startTransition } from 'react'
import { usePageSpaceToOverlaySpace, useWorldSpaceToPageSpace } from "@/hooks"
import { useStore, useStoreRef } from "@/store"
import { useEffect, useState } from "react"
import { useLerpState } from '@/hooks/useLerpState'
import { COLORS } from '@/constants'
import { lerpPoint2d, useInterpolatedState } from '@/hooks/useInteroplatedState'

type Props = {
    sessionId: string
}

const PresenceOverlayCursor = ({ sessionId }: Props) => {
    const sessionData = useStoreRef((state) => state.presence.sessions[sessionId])

    const cursor = useStore((state) => state.presence.cursors[sessionId])
    const cameraPosition = useStore((state) => state.camera.position)
    const cameraZoom = useStore((state) => state.camera.zoom)

    const [visibleCursor, setVisibleCursor] = useInterpolatedState(cursor ?? { x: 0, y: 0 }, lerpPoint2d)

    useEffect(() => {
        if (!cursor) {
            return
        }
        setVisibleCursor(cursor)
    }, [cursor?.x, cursor?.y])

    const worldSpaceToPageSpace = useWorldSpaceToPageSpace()
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const [pageX, pageY] = worldSpaceToPageSpace(visibleCursor.x, visibleCursor.y)
    const [left, top] = pageSpaceToOverlaySpace(pageX, pageY)

    if (!cursor) return null

    return <div className='np-absolute' style={{ left: `${left}px`, top: `${top}px` }}>
        <svg width="24" height="24" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.95446 1.30276L14.78282 5.35641Q15.7363 5.65771 14.81192 6.03921L9.37012 8.28467C8.87808 8.48771 8.48722 8.87857 8.28418 9.37061L6.03873 14.81241Q5.65723 15.7368 5.35593 14.78332L1.30228 1.95494Q1.00098 1.00146 1.95446 1.30276Z" fill={sessionData.current.color} stroke={COLORS.DARK} strokeWidth="2" vectorEffect='non-scaling-stroke' />
            {/* <path d="M1.00098 1.00146L15.7363 5.65771L9.37012 8.28467C8.87808 8.48771 8.48722 8.87857 8.28418 9.37061L5.65723 15.7368L1.00098 1.00146Z" fill="white" stroke={COLORS.DARK} strokeWidth="2" vectorEffect='non-scaling-stroke' /> */}
        </svg>
    </div>
}

export default React.memo(PresenceOverlayCursor)