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

    const radius = Math.min(width, height) / 2

    const { sessionColor, presenceColor } = useSelectionColor(node.instanceId)

    return (
        <g id={`color-swatch-body-${node.instanceId}`}>
            <circle
                cx={position.x + width - radius}
                cy={position.y + height / 2}
                r={radius}
                fill={presenceColor ?? sessionColor}
                stroke={COLORS.DARK}
                strokeWidth={2}
                pointerEvents="auto"
            />
        </g>
    )
}
