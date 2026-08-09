import React from "react"
import type * as NodePen from '@/types'
import { useStore } from "@/store"
import { NodeInternalStateProvider, usePresenceState } from "../context/node-state"
import { useDebugRender, useDraggableNode, useSelectableNode } from "../hooks"
import { GenericNodeSkeleton } from "../generic-node/components"

type ValueListProps = {
    id: string
    template: NodePen.NodeTemplate
}

const ValueList = ({ id, template }: ValueListProps) => {
    const node = useStore((store) => store.document.nodes[id])
    const internalState = usePresenceState(id)

    useDebugRender(node, template)

    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    if (!node) {
        return null
    }

    return (
        <NodeInternalStateProvider value={internalState}>
            <g id={`value-list-${id}`} ref={draggableTargetRef}>
                {node.status.isProvisional ? (<>
                    <GenericNodeSkeleton node={node} template={template} />
                </>) : (<g ref={selectableTargetRef}>
                    {/* Main body */}
                </g>)}
            </g>
        </NodeInternalStateProvider>

    )
}

export default React.memo(ValueList, (prev, next) => prev.id === next.id)