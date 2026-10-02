import type * as NodePen from '@/types'
import { COLORS } from '@/constants'
import { useSelectionColor } from '@/hooks/useSelectionColor'
import { useNodeInternalState } from '../../context/node-state'

type BooleanToggleBodyProps = {
    node: NodePen.DocumentNode
}

export const BooleanToggleBody = ({ node }: BooleanToggleBodyProps) => {
    const { position } = useNodeInternalState()

    const { width, height } = node.dimensions

    const { sessionColor, presenceColor } = useSelectionColor(node.instanceId)

    return (
        <g id={`boolean-toggle-body-${node.instanceId}`}>
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
