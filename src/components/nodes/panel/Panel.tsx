import React, { useCallback, useRef, useState } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { useDebugRender, useDraggableNode, useSelectableNode } from '../hooks'
import { PanelBody } from './components/PanelBody'
import { PanelShadow } from './components/PanelShadow'
import { PanelInput } from './components/PanelInput'
import { expireSolution } from '@/store/utils'
import { PanelPorts } from './components/PanelPorts'
import { GenericNodeWires } from '../wire'
import { PanelResizeTargets } from './components/PanelResizeTargets'
import { PanelDataTree } from './components/PanelDataTree'
import { NodeInternalStateProvider, useNodeInternalState, usePresenceState } from '../context/node-state'
import { GenericNodeSkeleton } from '../generic-node/components'
import { useIsEditable } from '@/hooks/useIsEditable'

type PanelProps = {
    id: string
    template: NodePen.NodeTemplate
}

const Panel = ({ id, template }: PanelProps) => {
    // Subscribe to current node state
    const node = useStore((store) => store.document.nodes[id])

    const isEditable = useIsEditable()

    const internalState = usePresenceState(id)

    const { apply } = useDispatch()

    const containerRef = useRef<SVGGElement>(null)

    // Attach debug behaviors
    useDebugRender(node, template)

    // Attach interactive behaviors
    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    const [isActive, setIsActive] = useState(false)
    const handleDoubleClick = useCallback((e: React.MouseEvent<SVGGElement>) => {
        e.stopPropagation()

        if (!isEditable) {
            return
        }

        setIsActive(true)
    }, [isEditable])

    const handleSubmit = useCallback((value: string) => {
        apply((state) => {
            const config = state.document.nodes[id]?.nodeConfiguration as NodePen.PanelConfig | undefined

            if (!config) {
                console.log(`🐍 Could not find config for panel ${id}`)
                return
            }

            config.textContent = value

            expireSolution(state)
        })
        setIsActive(false)
    }, [id])

    const handleScrollStart = useCallback(() => {
        containerRef.current?.setAttribute('data-scrolling', '')
    }, [])

    const handleScrollEnd = useCallback(() => {
        containerRef.current?.removeAttribute('data-scrolling')
    }, [])

    if (!node) {
        return null
    }

    return (
        <NodeInternalStateProvider value={internalState}>
            <g id={`panel-${id}`} ref={containerRef} style={{ pointerEvents: 'all' }} onDoubleClick={handleDoubleClick}>
                <g ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        {node.status.isProvisional ? (<>
                            <GenericNodeSkeleton node={node} template={template} />
                        </>) : (<>
                            <PanelShadow node={node} />
                            <PanelBody node={node} />
                            {node.sources['input'].length
                                ? <PanelDataTree node={node} onScrollStart={handleScrollStart} onScrollEnd={handleScrollEnd} />
                                : <PanelInput node={node} isActive={isActive} onSubmit={handleSubmit} />
                            }
                        </>)}
                    </g>
                </g>
                <PanelResizeTargets node={node} />
                {!node.status.isProvisional ? <PanelPorts node={node} template={template} /> : null}
            </g>
            <GenericNodeWires node={node} />
        </NodeInternalStateProvider>
    )
}

const propsAreEqual = (prevProps: Readonly<PanelProps>, nextProps: Readonly<PanelProps>): boolean => {
    return prevProps.id === nextProps.id
}

export default React.memo(Panel, propsAreEqual)