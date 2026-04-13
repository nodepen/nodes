import React, { useCallback, useState } from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { useDebugRender, useDraggableNode, useSelectableNode } from '../hooks'
import { PanelBody } from './components/PanelBody'
import { PanelShadow } from './components/PanelShadow'
import { PanelInput } from './components/PanelInput'

type PanelProps = {
    id: string
    template: NodePen.NodeTemplate
}

const Panel = ({ id, template }: PanelProps) => {
    // Subscribe to current node state
    const node = useStore((store) => store.document.nodes[id])
    const config = node.nodeConfiguration as NodePen.NumberSliderConfig

    // Attach debug behaviors
    useDebugRender(node, template)

    // Attach interactive behaviors
    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)
    // const { tr, tl, bl, br } = useResizableNode(id)

    return (
        <g id={`panel-${id}`} style={{ pointerEvents: 'all' }}>
            <g ref={draggableTargetRef}>
                <g ref={selectableTargetRef}>
                    <PanelShadow node={node} />
                    <PanelBody node={node} />
                </g>
            </g>
            <PanelInput node={node} />
        </g>
    )
}

const propsAreEqual = (prevProps: Readonly<PanelProps>, nextProps: Readonly<PanelProps>): boolean => {
    return prevProps.id === nextProps.id
}

export default React.memo(Panel, propsAreEqual)