import React from 'react'
import type * as NodePen from '@nodepen/core'
import { COLORS, DIMENSIONS } from '@/constants'
import { getNodeWidth, getNodeHeight } from '@/utils/node-dimensions'

const { NODE_PORT_RADIUS } = DIMENSIONS

type GenericNodeShadowProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GenericNodeShadow = ({ node, template }: GenericNodeShadowProps) => {
    const { position, inputs, outputs, anchors } = node

    const nodeWidth = getNodeWidth()
    const nodeHeight = getNodeHeight(template)

    const nodePortInstanceIds = [...Object.keys(inputs), ...Object.keys(outputs)]

    return (
        <>
            <rect
                x={position.x}
                y={position.y + 2}
                width={nodeWidth}
                height={nodeHeight}
                rx={7}
                ry={7}
                fill={COLORS.DARK}
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
            {nodePortInstanceIds.map((portInstanceId) => {
                const portAnchor = anchors[portInstanceId]

                if (!portAnchor) {
                    return null
                }

                const portPosition = {
                    x: position.x + portAnchor.dx - NODE_PORT_RADIUS,
                    y: position.y + portAnchor.dy - NODE_PORT_RADIUS,
                }

                return (
                    <rect
                        x={portPosition.x}
                        y={portPosition.y}
                        width={NODE_PORT_RADIUS * 2}
                        height={NODE_PORT_RADIUS * 2 + 2}
                        rx={NODE_PORT_RADIUS}
                        ry={NODE_PORT_RADIUS}
                        fill={COLORS.DARK}
                        stroke={COLORS.DARK}
                        strokeWidth={2}
                    />
                )
            })}
        </>
    )
}