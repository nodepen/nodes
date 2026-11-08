import React from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { useDebugRender, useDraggableNode, useSelectableNode } from '../hooks'
import {
    ExpressionBody,
    ExpressionContent,
    ExpressionShadow,
    ExpressionSkeleton,
} from './components'
import { GenericNodePorts, GenericNodeRuntimeMessage } from '../generic-node/components'
import { GenericNodeWires } from '../wire'
import { NodeInternalStateProvider, usePresenceState } from '../context/node-state'

type ExpressionProps = {
    id: string
    template: NodePen.NodeTemplate
}

const Expression = ({ id, template }: ExpressionProps) => {
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
            <g id={`expression-${id}`}>
                <g ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        {node.status.isProvisional ? (
                            <ExpressionSkeleton node={node} template={template} />
                        ) : (
                            <>
                                <ExpressionShadow node={node} template={template} />
                                <ExpressionBody node={node} template={template} />
                                <GenericNodePorts node={node} template={template} />
                            </>
                        )}
                    </g>
                </g>
                {node.status.isProvisional ? null : <ExpressionContent node={node} />}
            </g>
            {node.status.isProvisional ? null : <GenericNodeWires node={node} />}
        </NodeInternalStateProvider>
    )
}

const propsAreEqual = (prevProps: Readonly<ExpressionProps>, nextProps: Readonly<ExpressionProps>): boolean => {
    return prevProps.id === nextProps.id
}

export default React.memo(Expression, propsAreEqual)
