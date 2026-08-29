import React, { useCallback, useState } from "react"
import type * as NodePen from '@/types'
import { useStore } from "@/store"
import { NodeInternalStateProvider, usePresenceState } from "../context/node-state"
import { useDebugRender, useDraggableNode, useSelectableNode } from "../hooks"
import { GenericNodeSkeleton, GenericNodeShadow, GenericNodePorts, GenericNodeRuntimeMessage } from "../generic-node/components"
import { GradientBody } from "./components/GradientBody"
import { GenericNodeWires } from "../wire"
import { useIsEditable } from "@/hooks/useIsEditable"
import { Dialog, GradientEditor } from "@/views/components"

type GradientProps = {
    id: string
    template: NodePen.NodeTemplate
}

const Gradient = ({ id, template }: GradientProps) => {
    const node = useStore((store) => store.document.nodes[id])
    const internalState = usePresenceState(id)

    const isEditable = useIsEditable()

    useDebugRender(node, template)

    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    const [showEditor, setShowEditor] = useState(false)

    const handleDoubleClick = useCallback((e: React.MouseEvent<SVGGElement>) => {
        e.stopPropagation()

        if (!isEditable) {
            return
        }

        setShowEditor(true)
    }, [isEditable])

    const handleCloseEditor = useCallback(() => {
        setShowEditor(false)
    }, [])

    if (!node) {
        return null
    }

    const config = node.nodeConfiguration as NodePen.GradientConfig

    return (
        <NodeInternalStateProvider value={internalState}>
            <GenericNodeRuntimeMessage node={node} />
            <g id={`gradient-${id}`}>
                <g ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        {node.status.isProvisional ? (
                            <GenericNodeSkeleton node={node} template={template} />
                        ) : (<>
                            <GenericNodeShadow node={node} template={template} />
                            <GradientBody node={node} onDoubleClick={handleDoubleClick} />
                        </>)}
                    </g>
                </g>
                {!node.status.isProvisional ? (
                    <GenericNodePorts node={node} template={template} />
                ) : null}
            </g>
            {showEditor ? (
                <Dialog onClose={handleCloseEditor}>
                    <GradientEditor config={config} onClose={handleCloseEditor} />
                </Dialog>
            ) : null}
            <GenericNodeWires node={node} />
        </NodeInternalStateProvider>
    )
}

export default React.memo(Gradient, (prev, next) => prev.id === next.id)
