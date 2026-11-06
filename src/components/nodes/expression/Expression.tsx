import React, { useCallback, useRef, useState } from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { useIsEditable } from '@/hooks/useIsEditable'
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
import { Dialog } from '@/views/components'
import { ExpressionConfigForm } from './forms/ExpressionConfigForm'

type ExpressionProps = {
    id: string
    template: NodePen.NodeTemplate
}

const Expression = ({ id, template }: ExpressionProps) => {
    // Subscribe to current node state
    const node = useStore((store) => store.document.nodes[id])

    const isEditable = useIsEditable()

    const internalState = usePresenceState(id)

    // Attach debug behaviors
    useDebugRender(node, template)

    // Attach interactive behaviors
    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    const [showModal, setShowModal] = useState(false)
    const handleOpenModal = useCallback(() => setShowModal(true), [])
    const handleCloseModal = useCallback(() => setShowModal(false), [])

    const lastPointerType = useRef<string>('mouse')
    const handlePointerDown = useCallback((e: React.PointerEvent<SVGGElement>) => {
        lastPointerType.current = e.pointerType
    }, [])

    const handleDoubleClick = useCallback((e: React.MouseEvent<SVGGElement>) => {
        e.stopPropagation()

        if (!isEditable) {
            return
        }

        if (lastPointerType.current !== 'mouse') {
            return
        }

        setShowModal(true)
    }, [isEditable])

    if (!node) {
        return null
    }

    const config = (node.nodeConfiguration as NodePen.ExpressionConfig | undefined) ?? { expression: '' }

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
                                <ExpressionBody node={node} template={template} onDoubleClick={handleDoubleClick} onPointerDownCapture={handlePointerDown} />
                                <GenericNodePorts node={node} template={template} />
                            </>
                        )}
                    </g>
                </g>
                {node.status.isProvisional ? null : <ExpressionContent node={node} onClick={handleOpenModal} />}
            </g>
            {node.status.isProvisional ? null : <GenericNodeWires node={node} />}
            {showModal ? (
                <Dialog onClose={handleCloseModal}>
                    <ExpressionConfigForm node={node} config={config} onClose={handleCloseModal} />
                </Dialog>
            ) : null}
        </NodeInternalStateProvider>
    )
}

const propsAreEqual = (prevProps: Readonly<ExpressionProps>, nextProps: Readonly<ExpressionProps>): boolean => {
    return prevProps.id === nextProps.id
}

export default React.memo(Expression, propsAreEqual)
