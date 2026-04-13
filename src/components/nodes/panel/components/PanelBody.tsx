import type * as NodePen from '@/types'
import { useStore } from '$'
import { COLORS } from '@/constants'

type PanelBodyProps = {
    node: NodePen.DocumentNode
}

export const PanelBody = ({ node }: PanelBodyProps) => {
    const { position } = node
    const { width, height } = node.dimensions

    const documentSelection = useStore((state) => state.registry.selection.nodes)
    const isSelected = documentSelection.includes(node.instanceId)

    return (
        <g id={`panel-body-${node.instanceId}`}>
            <rect
                x={position.x}
                y={position.y}
                width={width}
                height={height}
                rx={7}
                ry={7}
                fill={isSelected ? COLORS.GREEN : COLORS.LIGHT}
                stroke={COLORS.DARK}
                strokeWidth={2}
                pointerEvents="auto"
            />
        </g>
    )
}