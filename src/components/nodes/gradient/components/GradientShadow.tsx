import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'

const { NODE_PORT_RADIUS } = DIMENSIONS

type GradientShadowProps = {
    node: NodePen.DocumentNode
}

export const GradientShadow = ({ node }: GradientShadowProps) => {
    const { position } = useNodeInternalState()

    const { width, height } = node.dimensions

    const portInstanceIds = [...Object.keys(node.inputs), ...Object.keys(node.outputs)]

    return (
        <>
            <rect
                x={position.x}
                y={position.y + 2}
                width={width}
                height={height}
                rx={7}
                ry={7}
                fill={COLORS.DARK}
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
            {portInstanceIds.map((portInstanceId) => {
                const anchor = node.anchors[portInstanceId]

                if (!anchor) {
                    return null
                }

                return (
                    <rect
                        key={`gradient-port-shadow-${portInstanceId}`}
                        x={position.x + anchor.dx - NODE_PORT_RADIUS}
                        y={position.y + anchor.dy - NODE_PORT_RADIUS}
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
