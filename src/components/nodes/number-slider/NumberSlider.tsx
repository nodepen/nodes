import type * as NodePen from '@/types'
import { useStore } from '$'
import { useDebugRender, useDraggableNode, useSelectableNode } from '../hooks'
import React from 'react'
import { NumberSliderBody } from './components/NumberSliderBody'
import { NumberSliderShadow } from './components/NumberSliderShadow'

type NumberSliderProps = {
    id: string
    template: NodePen.NodeTemplate
}

const NumberSlider = ({ id, template }: NumberSliderProps) => {
    // Subscribe to current node state
    const node = useStore((store) => store.document.nodes[id])
    const slider = node.nodeConfiguration as NodePen.NumberSliderConfig

    // Attach debug behaviors
    useDebugRender(node, template)

    // Attach interactive behaviors
    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    return (
        <g id={`number-slider-${id}`} ref={draggableTargetRef}>
            <g ref={selectableTargetRef}>
                <NumberSliderShadow node={node} />
                <NumberSliderBody node={node} />
            </g>
        </g>
    )
}

const propsAreEqual = (prevProps: Readonly<NumberSliderProps>, nextProps: Readonly<NumberSliderProps>): boolean => {
    return prevProps.id === nextProps.id
}

export default React.memo(NumberSlider, propsAreEqual)