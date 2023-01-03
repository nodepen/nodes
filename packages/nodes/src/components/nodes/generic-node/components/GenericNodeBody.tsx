import React from 'react'
import type * as NodePen from '@nodepen/core'
import { COLORS } from '@/constants'
import { getNodeWidth, getNodeHeight } from '@/utils/node-dimensions'

type GenericNodeBodyProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GenericNodeBody = ({ node, template }: GenericNodeBodyProps) => {
    const { position } = node

    const nodeWidth = getNodeWidth()
    const nodeHeight = getNodeHeight(template)

    return (
        <rect
            x={position.x}
            y={position.y}
            width={nodeWidth}
            height={nodeHeight}
            rx={7}
            ry={7}
            fill={COLORS.LIGHT}
            stroke={COLORS.DARK}
            strokeWidth={2}
            pointerEvents="auto"
        />
    )
}