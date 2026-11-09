import React, { useCallback, useEffect, useState } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { expireSolution } from '@/store/utils'
import { tryGetSingleValue } from '@/utils/data-trees'
import { createSingleValue } from '@/utils/data-trees/createSingleValue'
import { NodeInternalStateProvider, usePresenceState } from '../context/node-state'
import { useDebugRender, useDraggableNode, useSelectableNode } from '../hooks'
import { GenericNodeSkeleton } from '../generic-node/components'
import { MDSliderShadow } from './components/MDSliderShadow'
import { MDSliderBody } from './components/MDSliderBody'
import { MDSliderPorts } from './components/MDSliderPorts'
import { MDSliderConfigForm } from './forms/MDSliderConfigForm'
import { Dialog } from '@/views/components'
import { useDoubleClick } from '@/hooks/useDoubleClick'
import { useIsEditable } from '@/hooks/useIsEditable'
import { MDSliderCanvas, type MDSliderDomains, type MDSliderPoint } from './components/MDSliderCanvas'

type MDSliderProps = {
    id: string
    template: NodePen.NodeTemplate
}

const DEFAULT_DOMAIN: NodePen.MDSliderDomain = { min: 0, max: 1 }

const getPoint = (node?: NodePen.DocumentNode): MDSliderPoint => {
    const value = tryGetSingleValue(node?.values['input'])?.value

    const [x = 0, y = 0] = (value ?? '').split(',').map((coordinate) => Number.parseFloat(coordinate.trim()))

    return {
        x: Number.isFinite(x) ? x : 0,
        y: Number.isFinite(y) ? y : 0,
    }
}

const getDomains = (node?: NodePen.DocumentNode): MDSliderDomains => {
    const config = node?.nodeConfiguration as NodePen.MDSliderConfig | undefined

    return {
        x: config?.x ?? DEFAULT_DOMAIN,
        y: config?.y ?? DEFAULT_DOMAIN,
    }
}

const MDSlider = ({ id, template }: MDSliderProps) => {
    const node = useStore((store) => store.document.nodes[id])
    const internalState = usePresenceState(id)

    useDebugRender(node, template)

    const { apply, clearInterface } = useDispatch()

    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    const isEditable = useIsEditable()

    const [showModal, setShowModal] = useState(false)

    const handleDoubleClick = useCallback(() => {
        if (!isEditable) {
            return
        }

        setShowModal(true)
        clearInterface()
    }, [isEditable])

    const doubleClickRef = useDoubleClick<SVGGElement>(handleDoubleClick)

    const handleCloseModal = useCallback(() => {
        setShowModal(false)
    }, [])

    const [point, setPoint] = useState<MDSliderPoint>(() => getPoint(node))
    const [domains, setDomains] = useState<MDSliderDomains>(() => getDomains(node))

    const inputValue = node?.values['input']
    const nodeConfiguration = node?.nodeConfiguration

    useEffect(() => {
        setPoint(getPoint(node))
    }, [inputValue])

    useEffect(() => {
        setDomains(getDomains(node))
    }, [nodeConfiguration])

    const handleCommit = useCallback((next: MDSliderPoint) => {
        apply((state) => {
            const currentNode = state.document.nodes[id]

            if (!currentNode) {
                return
            }

            const config = currentNode.nodeConfiguration as NodePen.MDSliderConfig | undefined

            const [, , z = '0'] = (tryGetSingleValue(currentNode.values['input'])?.value ?? '').split(',')
            const nextZ = config?.mode === '3D' ? z.trim() : '0'

            currentNode.values['input'] = createSingleValue(`${next.x},${next.y},${nextZ}`, 'point')

            expireSolution(state)
        })
    }, [id])

    if (!node) {
        return null
    }

    return (
        <NodeInternalStateProvider value={internalState}>
            <g id={`md-slider-${id}`} ref={doubleClickRef} style={{ pointerEvents: 'all' }}>
                <g ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        {node.status.isProvisional ? (
                            <GenericNodeSkeleton node={node} template={template} />
                        ) : (<>
                            <MDSliderShadow node={node} />
                            <MDSliderBody node={node} />
                            <MDSliderCanvas
                                node={node}
                                value={point}
                                domains={domains}
                                onChange={setPoint}
                                onCommit={handleCommit}
                            />
                        </>)}
                    </g>
                </g>
                {!node.status.isProvisional ? (<>
                    <MDSliderPorts node={node} template={template} />
                </>) : null}
            </g>
            {showModal ? (
                <Dialog onClose={handleCloseModal}>
                    <MDSliderConfigForm node={node} config={node.nodeConfiguration as NodePen.MDSliderConfig} onClose={handleCloseModal} />
                </Dialog>
            ) : null}
        </NodeInternalStateProvider>
    )
}

export default React.memo(MDSlider, (prev, next) => prev.id === next.id)
