import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useNodeAnchorPosition } from '@/hooks'
import { COLORS, DIMENSIONS } from '@/constants'
import { usePort } from '../../hooks'

const { NODE_PORT_LABEL_FONT_SIZE, NODE_PORT_LABEL_OFFSET, NODE_PORT_RADIUS } = DIMENSIONS

type GenericNodePortProps = {
    nodeInstanceId: string
    portInstanceId: string
    template: NodePen.PortTemplate
}

const GenericNodePort = ({ nodeInstanceId, portInstanceId, template }: GenericNodePortProps) => {
    const portRef = usePort(nodeInstanceId, portInstanceId, template)

    const position = useNodeAnchorPosition(nodeInstanceId, portInstanceId)

    if (!position) {
        console.log(`🐍 Missing port position for node [${nodeInstanceId}]`)
        return null
    }

    const { __direction: direction } = template

    const labelPosition = {
        x: direction === 'input'
            ? position.x + NODE_PORT_LABEL_OFFSET
            : position.x - NODE_PORT_LABEL_OFFSET,
        y: position.y + 1.5 + NODE_PORT_LABEL_FONT_SIZE / 4
    }

    const labelTextAnchor = direction === 'input' ? 'start' : 'end'

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
                {template.nickName}
            </text>
        </g>
    )
}

export default React.memo(GenericNodePort)