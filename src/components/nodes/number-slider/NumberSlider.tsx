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
import { useRightClick } from '@/hooks/useRightClick'
import { getPortContextMenuKey } from '@/utils/keys/getPortContextMenuKey'
import { usePageSpaceToOverlaySpace } from '@/hooks'
import { getNumberSliderPortTemplate } from '@/utils/templates/getGenericParameterDefinition'
import { GenericNodeSkeleton } from '../generic-node/components'
import { useIsEditable } from '@/hooks/useIsEditable'

type NumberSliderProps = {
    id: string
    template: NodePen.NodeTemplate
}

const NumberSlider = ({ id, template }: NumberSliderProps) => {
    // Subscribe to current node state
    const node = useStore((store) => store.document.nodes[id])
    const config = node.nodeConfiguration as NodePen.NumberSliderConfig

    const isEditable = useIsEditable()

    const internalState = usePresenceState(id)

    const { apply } = useDispatch()

    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

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
    const { left } = useResizableNode(id, { computeAnchors, minWidth: 100 })

    const lastPointerType = useRef<'mouse' | 'pen' | 'touch'>('mouse')
    const handlePointerDown = useCallback((e: React.PointerEvent<SVGGElement>) => {
        lastPointerType.current = e.pointerType
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
    }, [])

    const handleDoubleClick = useCallback((e: React.MouseEvent<SVGGElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()

        if (!isEditable) {
            return
        }

        if (lastPointerType.current !== 'mouse') {
            return
        }

        useStore.getState().registry.numberSliderInputRef.current?.focus?.()

        setShowModal(true)
    }, [isEditable])

    const handleRightClick = useCallback((e: PointerEvent): void => {
        e.stopPropagation()

        if (!isEditable) {
            return
        }

        const { pageX, pageY } = e
        const key = getPortContextMenuKey(id, 'input')

        const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

        apply((state) => {
            state.registry.contextMenus[key] = {
                position: { x, y },
                context: {
                    type: 'port',
                    direction: 'input',
                    nodeInstanceId: id,
                    portInstanceId: 'input',
                    portTemplate: getNumberSliderPortTemplate(template)
                }
            }
        })
    }, [isEditable])

    const rightClickRef = useRightClick(handleRightClick)

    const s = 20

    return (
        <NodeInternalStateProvider value={internalState}>
            <g id={`number-slider-${id}`} ref={rightClickRef} style={{ pointerEvents: 'all' }} onDoubleClick={handleDoubleClick} onPointerDown={handlePointerDown}>
                {/* <NumberSliderInteractionArea node={node} /> */}
                <g ref={draggableTargetRef}>
                    <g ref={selectableTargetRef}>
                        {node.status.isProvisional ? (<>
                            <GenericNodeSkeleton node={node} template={template} />
                        </>) : (<>
                            <NumberSliderShadow node={node} />
                            <NumberSliderBody node={node} />
                        </>)}
                    </g>
                </g>
                {!node.status.isProvisional ? (<>
                    <NumberSliderSlider node={node} config={config} />
                    <NumberSliderPorts node={node} />
                    <NumberSliderValue node={node} onClick={() => setShowModal(true)} />
                </>) : null}
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