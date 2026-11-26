import React from 'react'
import type * as NodePen from '@/types'
import { usePort } from '../../hooks'
import { useNodeContextAnchorPosition } from '@/hooks'
import { COLORS, DIMENSIONS } from '@/constants'

const { NODE_PORT_LABEL_FONT_SIZE, NODE_PORT_RADIUS } = DIMENSIONS

type GradientOutputPortProps = {
    nodeInstanceId: string
    portInstanceId: string
    template: NodePen.PortTemplate
}

const GradientOutputPort = ({ nodeInstanceId, portInstanceId, template }: GradientOutputPortProps) => {
    const portRef = usePort(nodeInstanceId, portInstanceId, template)

    const position = useNodeContextAnchorPosition(nodeInstanceId, portInstanceId)

    if (!position) {
        console.log(`🐍 Missing port position for node [${nodeInstanceId}]`)
        return null
    }

    const eventTargetAreaOffset = 18

    const eventTargetAreaHeight = NODE_PORT_LABEL_FONT_SIZE * 2 + NODE_PORT_RADIUS * 2
    const eventTargetAreaWidth = NODE_PORT_RADIUS + eventTargetAreaOffset

    return (
        <g id={`gradient-output-port-${portInstanceId}`} ref={portRef}>
            <circle
                r={NODE_PORT_RADIUS}
                cx={position.x}
                cy={position.y}
                fill={COLORS.LIGHT}
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
            <rect
                x={position.x - NODE_PORT_RADIUS}
                y={position.y - eventTargetAreaHeight / 2}
                height={eventTargetAreaHeight}
                width={eventTargetAreaWidth}
                fill={COLORS.LIGHT}
                opacity={0}
            />
        </g>
    )
}

export default React.memo(GradientOutputPort)
