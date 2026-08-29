import type * as NodePen from '@/types'
import { COLORS } from '@/constants'
import { useSelectionColor } from '@/hooks/useSelectionColor'
import { useNodeInternalState } from '../../context/node-state'

type ColorSwatchBodyProps = {
    node: NodePen.DocumentNode
}

export const ColorSwatchBody = ({ node }: ColorSwatchBodyProps) => {
    const { position } = useNodeInternalState()

    const { width, height } = node.dimensions

    const { sessionColor, presenceColor } = useSelectionColor(node.instanceId)

    return (
        <g id={`color-swatch-body-${node.instanceId}`}>
            <rect
                x={position.x}
                y={position.y}
                width={width}
                height={height}
                rx={7}
                ry={7}
                fill={presenceColor ?? sessionColor}
                stroke={COLORS.DARK}
                strokeWidth={2}
                pointerEvents="auto"
            />
        </g>
    )
}
