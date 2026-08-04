import { AnnotationsOverlayPortal } from "@/components/annotations"
import { Wire } from "@/components/annotations/wire/Wire"
import { useNodeAnchorPosition } from "@/hooks"
import { lerpPoint2d, useInterpolatedState } from "@/hooks/useInteroplatedState"
import { useStore, useStoreRef } from "@/store"
import type { NodePortReference } from "@/types"
import { getPortDirection } from "@/utils/ports/getPortDirection"
import React, { useEffect, useMemo, useRef } from "react"

type Props = {
    sessionId: string
}

const PresenceOverlayWires = ({ sessionId }: Props) => {
    const sessionData = useStoreRef((state) => state.presence.sessions[sessionId])
    const wires = useStore((state) => state.presence.wires[sessionId] ?? [])

    return <>
        {wires.map((wire) => <PresenceOverlayWire key={`presence-wire-${wire.portAnchor.nodeInstanceId}-${wire.portAnchor.portInstanceId}-${wire.targetAnchor?.nodeInstanceId}-${wire.targetAnchor?.portInstanceId}`} sessionId={sessionId} portAnchor={wire.portAnchor} targetAnchor={wire.targetAnchor} />)}
    </>
}

type WireProps = {
    sessionId: string
    portAnchor: NodePortReference
    targetAnchor: NodePortReference | null
}

const PresenceOverlayWire = ({ sessionId, portAnchor, targetAnchor }: WireProps) => {
    const cursor = useStore((state) => state.presence.cursors[sessionId])

    const portDirection = useMemo(() => {
        const node = useStore.getState().document.nodes[portAnchor.nodeInstanceId]

        if (!node) {
            return null
        }

        try {
            return getPortDirection(node, portAnchor.portInstanceId)
        } catch (e) {
            return null
        }
    }, [portAnchor])

    const [cursorPosition, setCursorPosition] = useInterpolatedState(cursor ?? { x: 0, y: 0 }, lerpPoint2d)
    const previousCursor = useRef(cursor)

    const portAnchorPosition = useNodeAnchorPosition(portAnchor.nodeInstanceId ?? '', portAnchor.portInstanceId ?? '')
    const targetAnchorPosition = useNodeAnchorPosition(targetAnchor?.nodeInstanceId ?? '', targetAnchor?.portInstanceId ?? '')

    useEffect(() => {
        if (!cursor) {
            previousCursor.current = null
            return
        }

        setCursorPosition(cursor, { immediate: previousCursor.current === null })
        previousCursor.current = cursor
    }, [cursor])

    if (!cursor || !portAnchorPosition || !portDirection) {
        return null
    }

    const start = portDirection === 'output' ? portAnchorPosition : targetAnchorPosition ?? cursorPosition
    const end = portDirection === 'input' ? portAnchorPosition : targetAnchorPosition ?? cursorPosition

    const arrowDirection = portDirection === 'output' ? 'LTR' : 'RTL'
    const drawArrows = targetAnchorPosition ? undefined : arrowDirection

    return (
        <AnnotationsOverlayPortal>
            <Wire start={start} end={end} structure="single" drawArrows={drawArrows} />
        </AnnotationsOverlayPortal>
    )

}

export default React.memo(PresenceOverlayWires)