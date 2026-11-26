import React, { useCallback, useState } from "react"
import type * as NodePen from '@/types'
import { useStore } from "@/store"
import { useDispatch } from "$"
import { NodeInternalStateProvider, useBuildNodeInternalState } from "../context/node-state"
import { useDebugRender, useDraggableNode, useSelectableNode } from "../hooks"
import { GenericNodeSkeleton, GenericNodeRuntimeMessage } from "../generic-node/components"
import { GradientBody } from "./components/GradientBody"
import { GradientShadow } from "./components/GradientShadow"
import { GradientControlArea } from "./components/GradientControlArea"
import { GradientPorts } from "./components/GradientPorts"
import { GenericNodeWires } from "../wire"
import { useIsEditable } from "@/hooks/useIsEditable"
import { Dialog, GradientEditor } from "@/views/components"

type GradientProps = {
    id: string
    template: NodePen.NodeTemplate
}

const Gradient = ({ id, template }: GradientProps) => {
    const node = useStore((store) => store.document.nodes[id])
    const internalState = useBuildNodeInternalState(id)

    const isEditable = useIsEditable()

    useDebugRender(node, template)

    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    const [showEditor, setShowEditor] = useState(false)

    const { clearInterface } = useDispatch()

    const handleDoubleClick = useCallback(() => {
        if (!isEditable) {
            return
        }

        setShowEditor(true)
        clearInterface()
    }, [isEditable])

    const handleControlAreaClick = useCallback((e: React.MouseEvent<SVGGElement>) => {
        if (e.button !== 0) {
            return
        }

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

    const config = node.nodeConfiguration as NodePen.GradientConfig | undefined

    return (
        <NodeInternalStateProvider value={internalState}>
            <GenericNodeRuntimeMessage node={node} />
            <g id={`gradient-${id}`} style={{ pointerEvents: 'all' }}>
                <g ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        {node.status.isProvisional ? (
                            <GenericNodeSkeleton node={node} template={template} />
                        ) : (<>
                            <GradientShadow node={node} />
                            <GradientBody node={node} onDoubleClick={handleDoubleClick} />
                        </>)}
                    </g>
                </g>
                {!node.status.isProvisional ? (<>
                    <GradientControlArea
                        node={node}
                        template={template}
                        config={config}
                        onClick={handleControlAreaClick}
                        onDoubleClick={handleDoubleClick}
                    />
                    <GradientPorts node={node} template={template} />
                    <GenericNodeWires node={node} />
                </>) : null}
            </g>
            {showEditor && config ? (
                <Dialog onClose={handleCloseEditor}>
                    <GradientEditor config={config} onClose={handleCloseEditor} />
                </Dialog>
            ) : null}
        </NodeInternalStateProvider>
    )
}

export default React.memo(Gradient, (prev, next) => prev.id === next.id)
