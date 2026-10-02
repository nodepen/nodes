import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useLongHover, useNodeContextAnchorPosition, usePageSpaceToOverlaySpace } from '@/hooks'
import { COLORS, DIMENSIONS } from '@/constants'
import { usePort } from '../../hooks'
import { useDispatch } from '$'

const { NODE_PORT_LABEL_FONT_SIZE, NODE_PORT_RADIUS } = DIMENSIONS

type PanelPortProps = {
    nodeInstanceId: string
    portInstanceId: string
    template: NodePen.PortTemplate
}

const PanelPort = ({ nodeInstanceId, portInstanceId, template }: PanelPortProps) => {
    const portRef = usePort(nodeInstanceId, portInstanceId, template)

    const position = useNodeContextAnchorPosition(nodeInstanceId, portInstanceId)

    if (!position) {
        console.log(`🐍 Missing port position for node [${nodeInstanceId}]`)
        return null
    }

    const { __direction: direction } = template

    const eventTargetAreaOffset = 18

    const eventTargetAreaPosition = {
        x: direction === 'input'
            ? position.x - NODE_PORT_RADIUS - eventTargetAreaOffset
            : position.x - NODE_PORT_RADIUS,
        y: position.y - NODE_PORT_RADIUS - NODE_PORT_LABEL_FONT_SIZE
    }
    const eventTargetAreaHeight = NODE_PORT_LABEL_FONT_SIZE * 2 + NODE_PORT_RADIUS * 2
    const eventTargetAreaWidth = NODE_PORT_RADIUS + eventTargetAreaOffset

    return (
        <g id={`panel-port-${portInstanceId}`} ref={portRef}>
            <circle
                r={NODE_PORT_RADIUS}
                cx={position.x}
                cy={position.y}
                fill={COLORS.LIGHT}
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
            <g>
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

export default React.memo(PanelPort)