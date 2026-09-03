import React, { useCallback, useRef } from 'react'
import type * as NodePen from '@/types'
import { useDispatch } from '$'
import { COLORS } from '@/constants'
import { useLongHover, usePageSpaceToOverlaySpace } from '@/hooks'
import { getRelayPortTemplate } from '@/utils/templates/getGenericParameterDefinition'
import { useSelectionColor } from '@/hooks/useSelectionColor'
import { useNodeInternalState } from '../../context/node-state'

type RelayBodyProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const RelayBody = ({ node, template }: RelayBodyProps) => {
    const { position } = useNodeInternalState()

    const { width, height } = node.dimensions

    const { apply } = useDispatch()
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const { sessionColor, presenceColor } = useSelectionColor(node.instanceId)

    const lastPointerType = useRef<'mouse' | 'pen' | 'touch'>('mouse')
    const handlePointerDown = useCallback((e: React.PointerEvent<SVGGElement>): void => {
        lastPointerType.current = e.pointerType
    }, [])

    const handleLongHover = useCallback((e: PointerEvent): void => {
        const { pageX, pageY } = e

        const [x, y] = pageSpaceToOverlaySpace(pageX, pageY)

        apply((state) => {
            state.registry.tooltips[`port-tooltip-relay-${node.instanceId}`] = {
                configuration: {
                    position: {
                        x: x + 8,
                        y: y + 8,
                    },
                    isSticky: false
                },
                context: {
                    type: 'port',
                    nodeInstanceId: node.instanceId,
                    portInstanceId: 'output',
                    template: getRelayPortTemplate(template, 'output'),
                }
            }
        })
    }, [])

    const longHoverTarget = useLongHover<SVGGElement>(handleLongHover)

    return (
        <g id={`relay-body-${node.instanceId}`} ref={longHoverTarget} onPointerDown={handlePointerDown}>
            <rect
                x={position.x}
                y={position.y}
                width={width}
                height={height}
                rx={4}
                ry={4}
                fill={presenceColor ?? sessionColor}
                stroke={COLORS.DARK}
                strokeWidth={2}
                pointerEvents="auto"
            />
            <svg x={position.x + (width / 2) - (height / 2) - 1} y={position.y} width={height} height={height} viewBox='0 0 10 10' className='np-overflow-visible'>
                <path d="M 5 3 L 7 5 L 5 7" stroke={COLORS.DARK} strokeWidth={1} strokeLinejoin='round' strokeLinecap='round' fill="none" />
            </svg>
        </g>
    )
}
