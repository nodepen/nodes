import { lerpPoint2d, useInterpolatedState } from "@/hooks/useInteroplatedState";
import { useLerpState } from "@/hooks/useLerpState";
import { useDispatch, useStore } from "@/store";
import React, { startTransition, useEffect } from "react"
import type * as NodePen from '@/types'

export type NodeInternalState = {
    position: {
        x: number
        y: number
    };
}

const NodeInternalStateContext = React.createContext<NodeInternalState | undefined>(undefined)

type ProviderProps = React.PropsWithChildren<{
    value: NodeInternalState
}>

export const NodeInternalStateProvider = ({ value, children }: ProviderProps) => {
    return <NodeInternalStateContext.Provider value={value}>{children}</NodeInternalStateContext.Provider>
}

export const useNodeInternalState = () => {
    const context = React.useContext(NodeInternalStateContext)

    if (!context) {
        throw new Error("useNodeInternalState must be used within a NodeInternalStateProvider")
    }

    return context;
}

export const usePresenceState = (nodeInstanceId: string | null): NodeInternalState => {
    const node = useStore<NodePen.DocumentNode | null>((state) => state.document.nodes[nodeInstanceId ?? ''] ?? null)

    const { apply } = useDispatch()

    const [presencePosition, setPresencePosition] = useInterpolatedState(node?.position ?? { x: 0, y: 0 }, lerpPoint2d)

    // Position of instance based on active session drags
    const internalPosition = useStore((state) => {
        if (!state.registry.selection.nodes.includes(nodeInstanceId ?? '')) {
            return
        }

        const { isActive, isCopyActive, dx, dy } = state.registry.drag

        if (!isActive || isCopyActive) {
            return null
        }

        const node = state.document.nodes[nodeInstanceId ?? '']

        if (!node) {
            return null
        }

        return {
            x: node.position.x + dx,
            y: node.position.y + dy
        }
    })

    // Position of instance based on external drag presence state
    const latestPresencePosition = useStore((state) => {
        return Object.keys(state.presence.sessions).map((sessionId) => (state.presence.drag[nodeInstanceId ?? '']?.[sessionId] ?? null)).filter((drag) => !!drag).at(0) ?? null
    })

    // Sync presence drags
    useEffect(() => {
        if (!latestPresencePosition) {
            return
        }
        setPresencePosition(latestPresencePosition)
    }, [latestPresencePosition?.x, latestPresencePosition?.y])

    // Clean up session-based drag on next node update
    useEffect(() => {
        if (!node) {
            return
        }

        apply((state) => {
            for (const [sessionId, dragData] of Object.entries((state.presence.drag[nodeInstanceId ?? ''] ?? {}))) {
                if (dragData?.isFinal) {
                    delete state.presence.drag[nodeInstanceId ?? '']?.[sessionId]
                }
            }
        })
    }, [node, node?.position?.x, node?.position?.y])

    // console.log(latestPresencePosition?.x, latestPresencePosition?.y)
    // console.log(presencePosition.x, presencePosition.y)
    // console.log({ presencePosition, position: presencePosition })

    return { position: internalPosition ?? (latestPresencePosition && presencePosition) ?? node?.position ?? { x: 0, y: 0 } }
}
