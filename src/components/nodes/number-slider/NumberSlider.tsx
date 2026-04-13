import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { useDebugRender, useDraggableNode, useSelectableNode } from '../hooks'
import React, { useCallback, useState } from 'react'
import { NumberSliderBody } from './components/NumberSliderBody'
import { NumberSliderShadow } from './components/NumberSliderShadow'
import { NumberSliderSlider } from './components/NumberSliderSlider'
import { NumberSliderInteractionArea } from './components/NumberSliderInteractionArea'
import { NumberSliderPorts } from './components/NumberSliderPorts'
import { Dialog } from '@/views/components'
import { NumberSliderValue } from './components/NumberSliderValue'
import { NumberSliderConfigForm } from './forms/NumberSliderConfigForm'

type NumberSliderProps = {
    id: string
    template: NodePen.NodeTemplate
}

const NumberSlider = ({ id, template }: NumberSliderProps) => {
    // Subscribe to current node state
    const node = useStore((store) => store.document.nodes[id])
    const config = node.nodeConfiguration as NodePen.NumberSliderConfig

    const { apply } = useDispatch()

    // Attach debug behaviors
    useDebugRender(node, template)

    const [showModal, setShowModal] = useState(false)

    // Attach interactive behaviors
    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)

    const handleDoubleClick = useCallback((e: React.MouseEvent<SVGGElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()

        useStore.getState().registry.numberSliderInputRef.current?.focus?.()

        setShowModal(true)
    }, [])

    const handlePointerDown = useCallback((e: React.PointerEvent<SVGGElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }, [])

    // const handlePointerEnter = useCallback((e: React.PointerEvent<SVGGElement>) => {
    //     apply((state) => {
    //         if ((state.registry.contextMenus['number-slider']?.context as any)?.nodeInstanceId === node.instanceId) {
    //             return
    //         }

    //         state.registry.contextMenus['number-slider'] = {
    //             position: { x: 0, y: 0 },
    //             context: {
    //                 type: 'number-slider-value',
    //                 nodeInstanceId: node.instanceId
    //             }
    //         }
    //     })
    // }, [])

    return (
        <>
            <g id={`number-slider-${id}`} style={{ pointerEvents: 'all' }} onDoubleClick={handleDoubleClick} onPointerDown={handlePointerDown}>
                <NumberSliderInteractionArea node={node} />
                <g ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        <NumberSliderShadow node={node} />
                        <NumberSliderBody node={node} />
                    </g>
                </g>
                <NumberSliderSlider node={node} config={config} />
                <NumberSliderPorts node={node} />
                <NumberSliderValue node={node} onClick={() => setShowModal(true)} />
            </g>
            {showModal ? (
                <Dialog onClose={() => setShowModal(false)}>
                    <NumberSliderConfigForm node={node} config={config} onClose={() => setShowModal(false)} />
                </Dialog>
            ) : null}
        </>

    )
}

const propsAreEqual = (prevProps: Readonly<NumberSliderProps>, nextProps: Readonly<NumberSliderProps>): boolean => {
    return prevProps.id === nextProps.id
}

export default React.memo(NumberSlider, propsAreEqual)