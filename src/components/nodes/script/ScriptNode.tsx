import React, { useCallback, useRef } from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { useDebugRender, useDraggableNode, useSelectableNode } from '../hooks'
import {
    GenericNodePorts,
    GenericNodeRuntimeMessage,
    GenericNodeShadow,
    GenericNodeSkeleton,
} from '../generic-node/components'
import { ScriptNodeBody } from './components'
import { GenericNodeWires } from '../wire'
import { NodeInternalStateProvider, usePresenceState } from '../context/node-state'

type ScriptNodeProps = {
    id: string
    template: NodePen.NodeTemplate
}

const ScriptNode = ({ id, template }: ScriptNodeProps) => {
    // Subscribe to current node state
    const node = useStore((store) => store.document.nodes[id])

    const internalState = usePresenceState(id)

    // Attach debug behaviors
    useDebugRender(node, template)

    // Attach interactive behaviors
    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    const lastPointerType = useRef<string>('mouse')
    const handlePointerDown = useCallback((e: React.PointerEvent<SVGGElement>) => {
        lastPointerType.current = e.pointerType
    }, [])

    const handleDoubleClick = useCallback((e: React.MouseEvent<SVGGElement>) => {
        e.stopPropagation()

        // Touch is not supported yet
        if (lastPointerType.current !== 'mouse') {
            return
        }

        const state = useStore.getState()
        state.callbacks.onOpenScriptEditor?.(state, { nodeInstanceId: id })
    }, [id])

    if (!node) {
        return null
    }

    return (
        <NodeInternalStateProvider value={internalState}>
            <GenericNodeRuntimeMessage node={node} />
            <g id={`script-${id}`} ref={draggableTargetRef}>
                <g ref={selectableTargetRef}>
                    {node.status.isProvisional ? (
                        <GenericNodeSkeleton node={node} template={template} />
                    ) : (
                        <>
                            <GenericNodeShadow node={node} template={template} />
                            <ScriptNodeBody node={node} template={template} onDoubleClick={handleDoubleClick} onPointerDownCapture={handlePointerDown} />
                            <GenericNodePorts node={node} template={template} />
                        </>
                    )}
                </g>
            </g>
            {node.status.isProvisional ? null : <GenericNodeWires node={node} />}
        </NodeInternalStateProvider>
    )
}

const propsAreEqual = (prevProps: Readonly<ScriptNodeProps>, nextProps: Readonly<ScriptNodeProps>): boolean => {
    return prevProps.id === nextProps.id
}

export default React.memo(ScriptNode, propsAreEqual)
