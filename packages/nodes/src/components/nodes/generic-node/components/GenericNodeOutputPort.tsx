import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useNodeAnchorPosition } from '@/hooks'
import { COLORS, DIMENSIONS } from '@/constants'

const { NODE_PORT_LABEL_FONT_SIZE, NODE_PORT_LABEL_OFFSET, NODE_PORT_RADIUS } = DIMENSIONS

type GenericNodeInputPortProps = {
    nodeInstanceId: string
    portInstanceId: string
    template: NodePen.PortTemplate
}

const GenericNodeInputPort = ({ nodeInstanceId, portInstanceId, template }: GenericNodeInputPortProps) => {
    const anchorPosition = useNodeAnchorPosition(nodeInstanceId, portInstanceId)

    if (!anchorPosition) {
        console.log(`🐍 Missing port position for node [${nodeInstanceId}]`)
        return null
    }

    const labelPosition = {
        x: anchorPosition.x + NODE_PORT_LABEL_OFFSET,
        y: anchorPosition.y - 1.5 - NODE_PORT_LABEL_FONT_SIZE / 4
    }

    const labelTextAnchor = 'start'

    return (
        <>
            <circle
                r={NODE_PORT_RADIUS}
                cx={anchorPosition.x}
                cy={-anchorPosition.y}
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
                textAnchor={labelTextAnchor}
            >
                {template.nickName}
            </text>
        </>
    )
}

export default React.memo(GenericNodeInputPort)