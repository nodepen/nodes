import React, { useCallback, useState } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { NodeInternalStateProvider, usePresenceState } from '../context/node-state'
import { useDebugRender, useDraggableNode, useSelectableNode } from '../hooks'
import { GenericNodeSkeleton } from '../generic-node/components'
import { usePageSpaceToOverlaySpace } from '@/hooks'
import { useIsEditable } from '@/hooks/useIsEditable'
import { useRightClick } from '@/hooks/useRightClick'
import { useDoubleClick } from '@/hooks/useDoubleClick'
import { Dialog } from '@/views/components'
import { GraphMapperShadow } from './components/GraphMapperShadow'
import { GraphMapperBody } from './components/GraphMapperBody'
import { GraphMapperCanvas } from './components/GraphMapperCanvas'
import { GraphMapperPorts } from './components/GraphMapperPorts'
import { GraphMapperConfigForm } from './forms/GraphMapperConfigForm'

type GraphMapperProps = {
    id: string
    template: NodePen.NodeTemplate
}

const GraphMapper = ({ id, template }: GraphMapperProps) => {
    const node = useStore((store) => { return store.document.nodes[id] })
    const internalState = usePresenceState(id)

    useDebugRender(node, template)

    const { apply, clearInterface } = useDispatch()

    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    const isEditable = useIsEditable()

    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const handleRightClick = useCallback((e: PointerEvent) => {
        e.stopPropagation()
        e.preventDefault()

        if (!isEditable) {
            return
        }

        const { pageX, pageY } = e

        const key = `graph-mapper-menu-${id}`

        const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

        apply((state) => {
            state.registry.contextMenus[key] = {
                position: { x, y },
                context: {
                    type: 'graph-mapper',
                    nodeInstanceId: id,
                },
            }
        })
    }, [id, isEditable])

    const rightClickRef = useRightClick<SVGGElement>(handleRightClick, true)

    const [showModal, setShowModal] = useState(false)

    const handleDoubleClick = useCallback(() => {
        if (!isEditable) {
            return
        }

        setShowModal(true)
        clearInterface()
    }, [isEditable])

    useDoubleClick<SVGGElement>(handleDoubleClick, rightClickRef)

    const handleCloseModal = useCallback(() => {
        setShowModal(false)
    }, [])

    if (!node) {
        return null
    }

    const config = node.nodeConfiguration as NodePen.GraphMapperConfig | undefined

    return (
        <NodeInternalStateProvider value={internalState}>
            <g id={`graph-mapper-${id}`} style={{ pointerEvents: 'all' }}>
                <g ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        {node.status.isProvisional ? (
                            <GenericNodeSkeleton node={node} template={template} />
                        ) : (<g ref={rightClickRef}>
                            <GraphMapperShadow node={node} />
                            <GraphMapperBody node={node} />
                            <GraphMapperCanvas node={node} config={config} />
                        </g>)}
                    </g>
                </g>
                {!node.status.isProvisional ? (<>
                    <GraphMapperPorts node={node} template={template} />
                </>) : null}
            </g>
            {showModal && config ? (
                <Dialog onClose={handleCloseModal}>
                    <GraphMapperConfigForm node={node} config={config} onClose={handleCloseModal} />
                </Dialog>
            ) : null}
        </NodeInternalStateProvider>
    )
}

export default React.memo(GraphMapper, (prev, next) => { return prev.id === next.id })
