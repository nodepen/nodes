import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useLongHover, useNodeContextAnchorPosition, usePageSpaceToOverlaySpace } from '@/hooks'
import { COLORS, DIMENSIONS } from '@/constants'
import { usePort } from '../../hooks'
import { useDispatch, useStore } from '$'
import type { NodePenNodeType } from '@/utils/templates/getNodeTypeForTemplate'
import { FlattenFlagIcon } from '@/components/icons/FlattenFlagIcon'
import { GraftFlagIcon } from '@/components/icons/GraftFlagIcon'
import { SimplifyFlagIcon } from '@/components/icons/SimplifyFlagIcon'

const { NODE_PORT_LABEL_FONT_SIZE, NODE_PORT_LABEL_OFFSET, NODE_PORT_RADIUS, NODE_PORT_MINIMUM_WIDTH } = DIMENSIONS

type GenericNodePortProps = {
    nodeInstanceId: string
    portInstanceId: string
    template: NodePen.PortTemplate
    nodeType: NodePenNodeType
}

const GenericNodePort = ({ nodeInstanceId, portInstanceId, template, nodeType }: GenericNodePortProps) => {
    const portRef = usePort(nodeInstanceId, portInstanceId, template)

    const parameterLabels = useStore((state) => state.ui.preferences.parameterLabels)
    const useFullName = nodeType === 'generic-node' && parameterLabels === 'fullname'
    const labelText = useFullName ? template.name : template.nickName

    const { apply } = useDispatch()
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const handleLongHover = useCallback((e: PointerEvent): void => {
        const { pageX, pageY } = e

        const [x, y] = pageSpaceToOverlaySpace(pageX, pageY)

        apply((state) => {
            state.registry.tooltips[`port-tooltip-${nodeInstanceId}-${portInstanceId}`] = {
                configuration: {
                    position: {
                        x: x + 8,
                        y: y + 8,
                    },
                    isSticky: false,
                },
                context: {
                    type: 'port',
                    template,
                    nodeInstanceId,
                    portInstanceId,
                },
            }
        })
    }, [])

    const longHoverTarget = useLongHover<SVGGElement>(handleLongHover)

    const position = useNodeContextAnchorPosition(nodeInstanceId, portInstanceId)
    const flags = useStore((state) => state.document.nodes[nodeInstanceId]?.portConfigurations[portInstanceId]?.flags ?? [])
    const sortedFlags = [...flags].sort()

    if (!position) {
        console.log(`🐍 Missing port position for node [${nodeInstanceId}]`)
        return null
    }

    const { __direction: direction } = template

    const labelPosition = {
        x: direction === 'input' ? position.x + NODE_PORT_LABEL_OFFSET : position.x - NODE_PORT_LABEL_OFFSET,
        y: position.y + 1.5 + NODE_PORT_LABEL_FONT_SIZE / 4,
    }

    const labelTextAnchor = direction === 'input' ? 'start' : 'end'

    const eventTargetAreaOffset = 18

    const eventTargetAreaPosition = {
        x:
            direction === 'input'
                ? position.x - NODE_PORT_RADIUS - eventTargetAreaOffset
                : position.x - NODE_PORT_MINIMUM_WIDTH,
        y: position.y - NODE_PORT_RADIUS - NODE_PORT_LABEL_FONT_SIZE,
    }

    const eventTargetAreaHeight = NODE_PORT_LABEL_FONT_SIZE * 2 + NODE_PORT_RADIUS * 2

    const eventTargetAreaWidth = NODE_PORT_MINIMUM_WIDTH + NODE_PORT_RADIUS + eventTargetAreaOffset

    return (
        <g id={`generic-node-${direction}-port-${portInstanceId}`} ref={portRef}>
            <circle
                r={NODE_PORT_RADIUS}
                cx={position.x}
                cy={position.y}
                fill={COLORS.LIGHT}
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
            <text
                x={labelPosition.x}
                y={labelPosition.y}
                className="np-font-mono np-select-none"
                fontSize={NODE_PORT_LABEL_FONT_SIZE}
                fill={COLORS.DARK}
                textAnchor={labelTextAnchor}
            >
                {labelText}
            </text>
            {sortedFlags.map((flag, i) => {
                const key = `${direction}-flag-${flag}`

                const x = labelPosition.x + (direction === 'input' ? 4 : 0) + (((labelText.length * 15) + ((i + (direction === 'input' ? 0 : 1)) * 22)) * (direction === 'input' ? 1 : -1))
                const y = labelPosition.y - 15

                return (
                    <>
                        <rect x={x} y={y} width={18} height={18} stroke={COLORS.DARK} strokeWidth={2} rx={2} ry={2} fill={COLORS.LIGHT} />
                        {(() => {
                            const position = { x: x + 2, y: y + 2 }
                            switch (flag) {
                                case 'flatten': {
                                    return <FlattenFlagIcon key={key} position={position} />
                                }
                                case 'graft': {
                                    return <GraftFlagIcon key={key} position={position} />
                                }
                                case 'simplify': {
                                    return <SimplifyFlagIcon key={key} position={position} />
                                }
                                default: {
                                    return <></>
                                }
                            }
                        })()}
                    </>
                )

            })}
            <g ref={longHoverTarget}>
                <rect
                    x={eventTargetAreaPosition.x}
                    y={eventTargetAreaPosition.y}
                    height={eventTargetAreaHeight}
                    width={eventTargetAreaWidth}
                    fill={'#FFFFFF'}
                    opacity={0}
                />
            </g>
        </g>
    )
}

export default React.memo(GenericNodePort)
