import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { useDebugRender, useDraggableNode, useSelectableNode } from '../hooks'
import React, { useCallback, useRef, useState } from 'react'
import { NumberSliderBody } from './components/NumberSliderBody'
import { NumberSliderShadow } from './components/NumberSliderShadow'
import { NumberSliderSlider } from './components/NumberSliderSlider'
import { NumberSliderInteractionArea } from './components/NumberSliderInteractionArea'
import { NumberSliderPorts } from './components/NumberSliderPorts'
import { Dialog } from '@/views/components'
import { NumberSliderValue } from './components/NumberSliderValue'
import { NumberSliderConfigForm } from './forms/NumberSliderConfigForm'
import { useResizableNode } from '../hooks/useResizableNode'
import { NodeInternalStateProvider, useNodeInternalState, usePresenceState } from '../context/node-state'

type NumberSliderProps = {
    id: string
    template: NodePen.NodeTemplate
}

const NumberSlider = ({ id, template }: NumberSliderProps) => {
    // Subscribe to current node state
    const node = useStore((store) => store.document.nodes[id])
    const config = node.nodeConfiguration as NodePen.NumberSliderConfig

    const internalState = usePresenceState(id)

    const { apply } = useDispatch()

    // Attach debug behaviors
    useDebugRender(node, template)

    const computeAnchors = useCallback((next: NodePen.DocumentNode): NodePen.DocumentNode['anchors'] => {
        return {
            'labelDeltaX': {
                dx: 0,
                dy: 0
            },
            'output': {
                dx: next.dimensions.width,
                dy: next.dimensions.height / 2
            }
        }
    }, [])

    const [showModal, setShowModal] = useState(false)

    // Attach interactive behaviors
    const draggableTargetRef = useDraggableNode(id)
    const selectableTargetRef = useSelectableNode(id)
    const { left } = useResizableNode(id, { computeAnchors })

    const lastPointerType = useRef<'mouse' | 'pen' | 'touch'>('mouse')
    const handlePointerDown = useCallback((e: React.PointerEvent<SVGGElement>) => {
        lastPointerType.current = e.pointerType
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }, [])

    const handleDoubleClick = useCallback((e: React.MouseEvent<SVGGElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()

        if (lastPointerType.current !== 'mouse') {
            return
        }

        useStore.getState().registry.numberSliderInputRef.current?.focus?.()

        setShowModal(true)
    }, [])

    const s = 20

    return (
        <NodeInternalStateProvider value={internalState}>
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
                <g ref={left}>
                    <rect
                        x={internalState.position.x - s / 2}
                        y={internalState.position.y}
                        width={s}
                        height={node.dimensions.height}
                        fill="transparent"
                    />
                </g>
            </g>
            {showModal ? (
                <Dialog onClose={() => setShowModal(false)}>
                    <NumberSliderConfigForm node={node} config={config} onClose={() => setShowModal(false)} />
                </Dialog>
            ) : null}
        </NodeInternalStateProvider>

    )
}

const propsAreEqual = (prevProps: Readonly<NumberSliderProps>, nextProps: Readonly<NumberSliderProps>): boolean => {
    return prevProps.id === nextProps.id
}

export default React.memo(NumberSlider, propsAreEqual)