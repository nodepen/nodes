import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'

const { NODE_PORT_RADIUS } = DIMENSIONS

type MDSliderShadowProps = {
    node: NodePen.DocumentNode
}

export const MDSliderShadow = ({ node }: MDSliderShadowProps) => {
    const { position } = useNodeInternalState()

    const { width, height } = node.dimensions

    const outputAnchor = node.anchors['output']

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
            {outputAnchor ? (
                <rect
                    x={position.x + outputAnchor.dx - NODE_PORT_RADIUS}
                    y={position.y + outputAnchor.dy - NODE_PORT_RADIUS}
                    width={NODE_PORT_RADIUS * 2}
                    height={NODE_PORT_RADIUS * 2 + 2}
                    rx={NODE_PORT_RADIUS}
                    ry={NODE_PORT_RADIUS}
                    fill={COLORS.DARK}
                    stroke={COLORS.DARK}
                    strokeWidth={2}
                />
            ) : null}
        </>
    )
}
