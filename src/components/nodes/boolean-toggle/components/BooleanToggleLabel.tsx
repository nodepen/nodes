import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { usePortLabel } from '@/hooks/usePortLabel'
import { useNodeInternalState } from '../../context/node-state'

const { NODE_INTERNAL_PADDING, NODE_LABEL_FONT_SIZE, BOOLEAN_TOGGLE_SWITCH_SIZE } = DIMENSIONS

type BooleanToggleLabelProps = {
    node: NodePen.DocumentNode
}

export const BooleanToggleLabel = ({ node }: BooleanToggleLabelProps) => {
    const { position } = useNodeInternalState()

    const { instanceId: id, dimensions } = node

    const { currentLabel } = usePortLabel(node.instanceId, 'input')

    const labelY = position.y + dimensions.height / 2
    const labelStartX = position.x + NODE_INTERNAL_PADDING * 2
    const switchX = position.x + dimensions.width - NODE_INTERNAL_PADDING - BOOLEAN_TOGGLE_SWITCH_SIZE
    const labelEndX = switchX - NODE_INTERNAL_PADDING

    return (
        <>
            <path id={`boolean-toggle-label-path-${id}`} d={`M ${labelStartX} ${labelY} L ${labelEndX} ${labelY}`} />
            <text
                className="np-font-panel np-select-none np-pointer-events-none"
                fill={COLORS.DARK}
                fontSize={NODE_LABEL_FONT_SIZE}
                dominantBaseline="middle"
            >
                <textPath href={`#boolean-toggle-label-path-${id}`} startOffset="0%" textAnchor="start">
                    {currentLabel}
                </textPath>
            </text>
        </>
    )
}
