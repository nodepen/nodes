import { useLerpState } from "@/hooks/useLerpState";
import { useDispatch, useStore } from "@/store";
import React, { startTransition, useEffect } from "react"

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

export const usePresenceState = (nodeInstanceId: string): NodeInternalState => {
    const node = useStore((state) => state.document.nodes[nodeInstanceId])

    const { apply } = useDispatch()

    const [x, setX] = useLerpState(node?.position?.x ?? 0, 0.09)
    const [y, setY] = useLerpState(node?.position?.y ?? 0, 0.09)

    const internalPosition = useStore((state) => {
        return Object.keys(state.presence.sessions).map((sessionId) => (state.presence.drag[nodeInstanceId]?.[sessionId] ?? null)).filter((drag) => !!drag).at(0) ?? null
    })

    useEffect(() => {
        if (!internalPosition) {
            return
        }

        startTransition(() => {
            setX(internalPosition.x)
            setY(internalPosition.y)
        })
    }, [internalPosition?.x, internalPosition?.y])

    useEffect(() => {
        if (!node) {
            return
        }

        apply((state) => {
            for (const [sessionId, dragData] of Object.entries((state.presence.drag[nodeInstanceId] ?? {}))) {
                if (dragData?.isFinal) {
                    delete state.presence.drag[nodeInstanceId][sessionId]
                }
            }
        })

        setX(node.position.x, { immediate: true })
        setY(node.position.y, { immediate: true })
    }, [node?.position?.x, node?.position?.y])

    return {
        position: {
            x,
            y
        }
    }
}
