import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'

const { NODE_PORT_RADIUS } = DIMENSIONS

type GraphMapperShadowProps = {
    node: NodePen.DocumentNode
}

export const GraphMapperShadow = ({ node }: GraphMapperShadowProps) => {
    const { position } = useNodeInternalState()

    const { width, height } = node.dimensions

    const portAnchors = [node.anchors['input'], node.anchors['output']]

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
            {portAnchors.map((anchor, i) => {
                if (!anchor) {
                    return null
                }

                return (
                    <rect
                        key={`graph-mapper-port-shadow-${i}`}
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
