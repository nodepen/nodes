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

    const [position, setPosition] = useInterpolatedState(node?.position ?? { x: 0, y: 0 }, lerpPoint2d)

    const internalPosition = useStore((state) => {
        return Object.keys(state.presence.sessions).map((sessionId) => (state.presence.drag[nodeInstanceId ?? '']?.[sessionId] ?? null)).filter((drag) => !!drag).at(0) ?? null
    })

    useEffect(() => {
        if (!internalPosition) {
            return
        }
        setPosition(internalPosition)
    }, [internalPosition?.x, internalPosition?.y])

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

        setPosition(node.position, { immediate: true })
    }, [node, node?.position?.x, node?.position?.y])

    return { position }
}
