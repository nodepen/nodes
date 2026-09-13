import React, { useEffect } from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { useDebugRender, useDraggableNode, useSelectableNode } from '../hooks'
import {
    GenericNodeBody,
    GenericNodePorts,
    GenericNodeRuntimeMessage,
    GenericNodeShadow,
    GenericNodeSkeleton,
    GenericNodeToggleLabel,
} from './components'
import { GenericNodeWires } from '../wire'
import { NodeInternalStateProvider, usePresenceState } from '../context/node-state'

type GenericNodeProps = {
    id: string
    template: NodePen.NodeTemplate
}

/**
 * Renders most standard nodes that don't require custom UI.
 * ZUI (add/remove params) and custom menus (toggles) are inferred from template and solution data.
 */
const GenericNode = ({ id, template }: GenericNodeProps) => {
    // Subscribe to current node state
    const node = useStore((store) => store.document.nodes[id])

    const internalState = usePresenceState(id)

    // Attach debug behaviors
    useDebugRender(node, template)

    // Attach interactive behaviors
    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    if (!node) {
        return null
    }

    return (
        <NodeInternalStateProvider value={internalState}>
            <GenericNodeRuntimeMessage node={node} />
            <g id={`generic-node-${id}`} ref={draggableTargetRef}>
                <g ref={selectableTargetRef}>
                    {node.status.isProvisional ? (
                        <>
                            <GenericNodeSkeleton node={node} template={template} />
                        </>
                    ) : (
                        <>
                            <GenericNodeToggleLabel node={node} template={template} />
                            <GenericNodeShadow node={node} template={template} />
                            <GenericNodeBody node={node} template={template} />
                            <GenericNodePorts node={node} template={template} />
                        </>
                    )}
                </g>
            </g>
            {node.status.isProvisional ? null : <GenericNodeWires node={node} />}
        </NodeInternalStateProvider>
    )
}

const propsAreEqual = (prevProps: Readonly<GenericNodeProps>, nextProps: Readonly<GenericNodeProps>): boolean => {
    return prevProps.id === nextProps.id
}

export default React.memo(GenericNode, propsAreEqual)
