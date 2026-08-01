import React from 'react'
import { usePageSpaceToOverlaySpace, useWorldSpaceToPageSpace } from "@/hooks"
import { useStore } from "@/store"
import { useEffect, useState } from "react"
import { useLerpState } from '@/hooks/useLerpState'

type Props = {
    sessionId: string
}

const PresenceOverlayCursor = ({ sessionId }: Props) => {
    const cursor = useStore((state) => state.presence.cursors[sessionId])
    const cameraPosition = useStore((state) => state.camera.position)
    const cameraZoom = useStore((state) => state.camera.zoom)

    const [cursorX, setCursorX] = useLerpState(cursor.x)
    const [cursorY, setCursorY] = useLerpState(cursor.y)

    useEffect(() => {
        setCursorX(cursor.x)
        setCursorY(cursorY)
    }, [cursor.x, cursor.y])

    const worldSpaceToPageSpace = useWorldSpaceToPageSpace()
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const [pageX, pageY] = worldSpaceToPageSpace(cursorX, cursorY)
    const [left, top] = pageSpaceToOverlaySpace(pageX, pageY)

    return <div className='np-absolute np-w-4 np-h-4 np-bg-dark' style={{ left: `${left}px`, top: `${top}px` }} />
}

export default React.memo(PresenceOverlayCursor)