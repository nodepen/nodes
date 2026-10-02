import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'

const { NODE_PORT_RADIUS } = DIMENSIONS

type ColorSwatchShadowProps = {
    node: NodePen.DocumentNode
}

export const ColorSwatchShadow = ({ node }: ColorSwatchShadowProps) => {
    const { position } = useNodeInternalState()

    const { anchors } = node

    const nodeWidth = node.dimensions.width
    const nodeHeight = node.dimensions.height

    const radius = Math.min(nodeWidth, nodeHeight) / 2

    const nodePortInstanceIds = ['output']

    return (
        <>
            <circle
                cx={position.x + nodeWidth - radius}
                cy={position.y + nodeHeight / 2 + 2}
                r={radius}
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
