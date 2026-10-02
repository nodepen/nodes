import React from 'react'
import { useStore } from '$'
import { useDraggableNode, useSelectableNode } from '../hooks'
import { ClusterBody, ClusterLabel, ClusterPorts, ClusterShadow } from './components'
import { GenericNodeWires } from '../wire'
import { NodeInternalStateProvider, usePresenceState } from '../context/node-state'

type ClusterProps = {
    id: string
}

const Cluster = ({ id }: ClusterProps) => {
    // Subscribe to current node state
    const node = useStore((store) => store.document.nodes[id])

    const internalState = usePresenceState(id)

    // Attach interactive behaviors
    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    if (!node) {
        return null
    }

    return (
        <NodeInternalStateProvider value={internalState}>
            {/* <GenericNodeRuntimeMessage node={node} /> */}
            <g id={`cluster-${id}`} ref={draggableTargetRef}>
                <g ref={selectableTargetRef}>
                    <ClusterLabel node={node} />
                    <ClusterShadow node={node} />
                    <ClusterBody node={node} />
                    <ClusterPorts node={node} />
                </g>
            </g>
            <GenericNodeWires node={node} />
        </NodeInternalStateProvider>
    )
}

const propsAreEqual = (prevProps: Readonly<ClusterProps>, nextProps: Readonly<ClusterProps>): boolean => {
    return prevProps.id === nextProps.id
}

export default React.memo(Cluster, propsAreEqual)
