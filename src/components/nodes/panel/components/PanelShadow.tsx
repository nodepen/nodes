import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'

const { NODE_PORT_RADIUS } = DIMENSIONS

type PanelShadowProps = {
    node: NodePen.DocumentNode
}

export const PanelShadow = ({ node }: PanelShadowProps) => {
    const { anchors } = node

    const { x, y } = node.position
    const { width, height } = node.dimensions

    const nodePortInstanceIds = ['input', 'output']

    return (
        <>
            <rect
                x={x}
                y={y + 2}
                width={width}
                height={height}
                rx={7}
                ry={7}
                fill={COLORS.DARK}
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
            {nodePortInstanceIds.map((portInstanceId) => {
                const anchor = anchors[portInstanceId]

                if (!anchor) {
                    return null
                }

                const { dx, dy } = anchor

                const portPosition = {
                    x: x + dx - NODE_PORT_RADIUS,
                    y: y + dy - NODE_PORT_RADIUS
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
            })
            }
        </>
    )

}