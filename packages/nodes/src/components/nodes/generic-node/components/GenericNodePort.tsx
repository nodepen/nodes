import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useNodeAnchorPosition } from '@/hooks'
import { COLORS, DIMENSIONS } from '@/constants'

const { NODE_PORT_LABEL_FONT_SIZE, NODE_PORT_RADIUS } = DIMENSIONS

type GenericNodePortProps = {
    nodeInstanceId: string
    portInstanceId: string
    template: NodePen.PortTemplate
    direction: 'input' | 'output'
}

const GenericNodePort = ({ nodeInstanceId, portInstanceId, template, direction }: GenericNodePortProps) => {
    const position = useNodeAnchorPosition(nodeInstanceId, portInstanceId)

    if (!position) {
        console.log(`🐍 Missing port position for node [${nodeInstanceId}]`)
        return null
    }

    const { x, y } = position

    const labelPosition = {
        x: direction === 'input'
            ? x + 12
            : x - 12,
        y: y - 1.5 - NODE_PORT_LABEL_FONT_SIZE / 4
    }

    const labelAnchor = direction === 'input'
        ? 'start'
        : 'end'

    return (
        <>
            <circle
                r={NODE_PORT_RADIUS}
                cx={x}
                cy={-y}
                fill={COLORS.LIGHT}
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
            <text
                x={labelPosition.x}
                y={-labelPosition.y}
                className="np-font-mono np-select-none"
                fontSize={NODE_PORT_LABEL_FONT_SIZE}
                fill={COLORS.DARK}
                textAnchor={labelAnchor}
            >
                {template.nickName}
            </text>
        </>
    )
}

export default React.memo(GenericNodePort)