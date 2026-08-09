import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { useDraggableNode, useSelectableNode } from '../hooks'
import { COLORS } from '@/constants'
import { GenericParameterBody } from './GenericParameterBody'
import { GenericParameterIcon } from './GenericParameterIcon'
import { GenericParameterShadow } from './GenericParameterShadow'
import { GenericParameterPorts } from './GenericParameterPorts'
import { GenericParameterLabel } from './GenericParameterLabel'
import { NodeInternalStateProvider, usePresenceState } from '../context/node-state'
import { GenericNodeWires } from '../wire'
import { GenericNodeRuntimeMessage, GenericNodeSkeleton } from '../generic-node/components'
import { useResizableNode } from '../hooks/useResizableNode'
import { GenericParameterResizeHandle } from './GenericParameterResizeHandle'

type GenericParameterProps = {
    id: string
    template: NodePen.NodeTemplate
}

const GenericParameter = ({ id, template }: GenericParameterProps): React.ReactElement => {
    // Subscribe to current node state
    const node = useStore((store) => store.document.nodes[id])

    const internalState = usePresenceState(id)

    // Attach interactive behaviors
    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    return (
        <NodeInternalStateProvider value={internalState}>
            <GenericNodeRuntimeMessage node={node} />
            <g className='np-group'>
                <g id={`generic-parameter-${id}`} ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        {node.status.isProvisional ? (<>
                            <GenericNodeSkeleton node={node} template={template} />

                        </>) : (<>
                            <GenericParameterShadow node={node} template={template} />
                            <GenericParameterBody node={node} template={template} />
                            <GenericParameterIcon node={node} template={template} />
                            <GenericParameterLabel node={node} template={template} />
                            <GenericParameterPorts node={node} />
                        </>)}
                    </g>
                </g>
                <GenericParameterResizeHandle node={node} />
            </g>
            <GenericNodeWires node={node} />
        </NodeInternalStateProvider>
    )
}

const propsAreEqual = (prev: Readonly<GenericParameterProps>, next: Readonly<GenericParameterProps>): boolean => {
    return prev.id === next.id
}

export default React.memo(GenericParameter, propsAreEqual)