import React from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { useDraggableNode, useSelectableNode } from '../hooks'
import { RelayShadow } from './components/RelayShadow'
import { RelayBody } from './components/RelayBody'
import { RelayPorts } from './components/RelayPorts'
import { NodeInternalStateProvider, usePresenceState } from '../context/node-state'
import { GenericNodeWires } from '../wire'
import { GenericNodeRuntimeMessage, GenericNodeSkeleton } from '../generic-node/components'

type RelayProps = {
    id: string
    template: NodePen.NodeTemplate
}

const Relay = ({ id, template }: RelayProps): React.ReactElement | null => {
    const node = useStore((store) => store.document.nodes[id])

    const internalState = usePresenceState(id)

    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    if (!node) {
        return null
    }

    return (
        <NodeInternalStateProvider value={internalState}>
            <g id={`relay-${id}`} ref={draggableTargetRef}>
                <g ref={selectableTargetRef}>
                    <RelayShadow node={node} />
                    <RelayBody node={node} template={template} />
                </g>
                <RelayPorts node={node} />
            </g>
            <GenericNodeWires node={node} />
        </NodeInternalStateProvider>
    )
}

const propsAreEqual = (prev: Readonly<RelayProps>, next: Readonly<RelayProps>): boolean => {
    return prev.id === next.id
}

export default React.memo(Relay, propsAreEqual)
