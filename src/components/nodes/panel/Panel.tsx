import React, { useCallback, useState } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { useDebugRender, useDraggableNode, useSelectableNode } from '../hooks'
import { PanelBody } from './components/PanelBody'
import { PanelShadow } from './components/PanelShadow'
import { PanelInput } from './components/PanelInput'
import { expireSolution } from '@/store/utils'
import { PanelPorts } from './components/PanelPorts'
import { GenericNodeWires } from '../wire'

type PanelProps = {
    id: string
    template: NodePen.NodeTemplate
}

const Panel = ({ id, template }: PanelProps) => {
    // Subscribe to current node state
    const node = useStore((store) => store.document.nodes[id])
    const config = node.nodeConfiguration as NodePen.NumberSliderConfig

    const { apply } = useDispatch()

    // Attach debug behaviors
    useDebugRender(node, template)

    // Attach interactive behaviors
    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)
    // const { tr, tl, bl, br } = useResizableNode(id)

    const [isActive, setIsActive] = useState(false)
    const handleDoubleClick = useCallback((e: React.MouseEvent<SVGGElement>) => {
        e.stopPropagation()
        setIsActive(true)
    }, [])

    const handleSubmit = useCallback((value: string) => {
        apply((state) => {
            const config = state.document.nodes[id].nodeConfiguration as NodePen.PanelConfig

            if (!config) {
                console.log(`🐍 Could not find config for panel ${id}`)
                return
            }

            config.textContent = value

            expireSolution(state)
        })
        setIsActive(false)
    }, [id])

    return (
        <>
            <g id={`panel-${id}`} style={{ pointerEvents: 'all' }} onDoubleClick={handleDoubleClick}>
                <g ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        <PanelShadow node={node} />
                        <PanelBody node={node} />
                        <PanelPorts node={node} template={template} />
                        <PanelInput node={node} isActive={isActive} onSubmit={handleSubmit} />
                    </g>
                </g>
            </g>
            <GenericNodeWires node={node} />
        </>
    )
}

const propsAreEqual = (prevProps: Readonly<PanelProps>, nextProps: Readonly<PanelProps>): boolean => {
    return prevProps.id === nextProps.id
}

export default React.memo(Panel, propsAreEqual)