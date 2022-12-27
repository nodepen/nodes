import React from 'react'
import { useNodeAnchorPosition } from '@/hooks'
import { COLORS, DIMENSIONS } from '@/constants'

const { NODE_PORT_RADIUS } = DIMENSIONS

type GenericNodePortProps = {
    nodeInstanceId: string
    portInstanceId: string
    direction: 'input' | 'output'
}

const GenericNodePort = ({ nodeInstanceId, portInstanceId, direction }: GenericNodePortProps) => {
    const position = useNodeAnchorPosition(nodeInstanceId, portInstanceId)

    if (!position) {
        console.log(`🐍 Missing port position for node [${nodeInstanceId}]`)
        return null
    }

    const { x, y } = position

    return (
        <circle
        r={NODE_PORT_RADIUS}
        cx={x}
        cy={-y}
        fill={COLORS.LIGHT}
        stroke={COLORS.DARK}
        strokeWidth={2}
      />
    )
}

export default React.memo(GenericNodePort)