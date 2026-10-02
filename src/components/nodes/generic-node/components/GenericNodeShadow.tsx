import React from 'react'
import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { usePresenceSelectionColor } from '@/hooks/usePresenceSelectionColor'
import { useNodeInternalState } from '../../context/node-state'
import { getLeftRoundedRectanglePath } from '@/utils/geometry'

const { NODE_PORT_RADIUS } = DIMENSIONS

type GenericNodeShadowProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GenericNodeShadow = ({ node, template }: GenericNodeShadowProps) => {
    const { inputs, outputs, anchors } = node

    const { position } = useNodeInternalState()

    const nodeWidth = node.dimensions.width
    const nodeHeight = node.dimensions.height

    const nodePortInstanceIds = [...Object.keys(inputs), ...Object.keys(outputs)]

    const hasOutputs = Object.keys(outputs).length > 0

    // const stroke = usePresenceSelectionColor(node.instanceId)

    return (
        <>
            {hasOutputs ? (
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
            ) : (
                <path
                    d={getLeftRoundedRectanglePath(position.x, position.y + 2, nodeWidth, nodeHeight, 7)}
                    fill={COLORS.DARK}
                    stroke={COLORS.DARK}
                    strokeWidth={2}
                />
            )}
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
                        key={`port-shadow-${portInstanceId}`}
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
