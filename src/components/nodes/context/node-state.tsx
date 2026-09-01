import { lerpPoint2d, useInterpolatedState } from "@/hooks/useInterpolatedState";
import { useDispatch, useStore } from "@/store";
import React, { useEffect } from "react"
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
    const internalPositionX = useStore((state) => {
        if (!state.registry.drag.includedNodeIds[nodeInstanceId ?? '']) {
            return null
        }

        const { isActive, isCopyActive, dx } = state.registry.drag

        if (!isActive || isCopyActive) {
            return null
        }

        const node = state.document.nodes[nodeInstanceId ?? '']

        if (!node) {
            return null
        }

        return node.position.x + dx
    })

    const internalPositionY = useStore((state) => {
        if (!state.registry.drag.includedNodeIds[nodeInstanceId ?? '']) {
            return null
        }

        const { isActive, isCopyActive, dy } = state.registry.drag

        if (!isActive || isCopyActive) {
            return null
        }

        const node = state.document.nodes[nodeInstanceId ?? '']

        if (!node) {
            return null
        }

        return node.position.y + dy
    })

    const internalPosition = internalPositionX !== null && internalPositionY !== null
        ? { x: internalPositionX, y: internalPositionY }
        : null

    // Position of instance based on external drag presence state
    const latestPresencePosition = useStore((state) => {
        const reconciled = state.registry.remoteDrags[nodeInstanceId ?? '']

        return Object.keys(state.presence.sessions).map((sessionId) => {
            const drag = state.presence.drag[nodeInstanceId ?? '']?.[sessionId] ?? null

            if (!drag) {
                return null
            }

            // Ignore drags already handled by current session (i.e. no replay from multiplayer)
            const resolved = reconciled?.[sessionId]
            if (resolved && resolved.x === drag.x && resolved.y === drag.y) {
                return null
            }

            return drag
        }).filter((drag) => !!drag).at(0) ?? null
    })

    // Sync presence drags
    useEffect(() => {
        if (!latestPresencePosition) {
            return
        }
        setPresencePosition(latestPresencePosition)
    }, [latestPresencePosition?.x, latestPresencePosition?.y])

    useEffect(() => {
        if (!node) {
            return
        }

        apply((state) => {
            for (const [sessionId, dragData] of Object.entries((state.presence.drag[nodeInstanceId ?? ''] ?? {}))) {
                if (dragData?.isFinal) {
                    const key = nodeInstanceId ?? ''
                    state.registry.remoteDrags[key] ??= {}
                    state.registry.remoteDrags[key][sessionId] = { x: dragData.x, y: dragData.y }
                    delete state.presence.drag[key]?.[sessionId]
                }
            }
        })
    }, [node, node?.position?.x, node?.position?.y])

    return { position: internalPosition ?? (latestPresencePosition && presencePosition) ?? node?.position ?? { x: 0, y: 0 } }
}
