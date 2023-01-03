import React from 'react'
import type * as NodePen from '@nodepen/core'
import { COLORS, DIMENSIONS } from '@/constants'
import { getNodeWidth, getNodeHeight } from '@/utils/node-dimensions'

const { NODE_INTERNAL_PADDING, NODE_LABEL_FONT_SIZE, NODE_LABEL_WIDTH } = DIMENSIONS

type GenericNodeLabelProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GenericNodeLabel = ({ node, template }: GenericNodeLabelProps) => {
    const { instanceId: id, position } = node

    const nodeWidth = getNodeWidth()
    const nodeHeight = getNodeHeight(template)

    return (
        <>
            <rect
                x={position.x + nodeWidth / 2 - NODE_LABEL_WIDTH / 2}
                y={position.y + NODE_INTERNAL_PADDING}
                width={NODE_LABEL_WIDTH}
                height={nodeHeight - NODE_INTERNAL_PADDING * 2}
                rx={7}
                ry={7}
                fill={COLORS.LIGHT}
                stroke={COLORS.DARK}
                strokeWidth={2}
                pointerEvents="none"
            />
            <path
                id={`node-label-${id}`}
                fill="none"
                d={`M ${position.x + nodeWidth / 2 + NODE_LABEL_FONT_SIZE / 2 - 3} ${position.y + nodeHeight} L ${
                    position.x + nodeWidth / 2 + NODE_LABEL_FONT_SIZE / 2 - 3
                } ${position.y}`}
            />
            <text className="np-font-panel np-select-none" fill={COLORS.DARK} fontSize={NODE_LABEL_FONT_SIZE}>
                <textPath href={`#node-label-${id}`} startOffset="50%" textAnchor="middle" alignmentBaseline="middle">
                    {template.nickName.toUpperCase()}
                </textPath>
            </text>
        </>
    )
}