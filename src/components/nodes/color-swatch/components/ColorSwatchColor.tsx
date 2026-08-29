import type * as NodePen from '@/types'
import { DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'

const { NODE_INTERNAL_PADDING } = DIMENSIONS

type ColorSwatchColorProps = {
    node: NodePen.DocumentNode
}

/** Renders the node's configured RGB value as a fill inset within its body. */
export const ColorSwatchColor = ({ node }: ColorSwatchColorProps) => {
    const { position } = useNodeInternalState()

    const { width, height } = node.dimensions
    const { r, g, b } = node.nodeConfiguration as NodePen.ColorSwatchConfig

    const x = position.x + NODE_INTERNAL_PADDING
    const y = position.y + NODE_INTERNAL_PADDING
    const w = width - NODE_INTERNAL_PADDING * 2
    const h = height - NODE_INTERNAL_PADDING * 2

    return (
        <rect
            className="np-pointer-events-none"
            x={x}
            y={y}
            width={w}
            height={h}
            rx={4}
            ry={4}
            fill={`rgb(${r}, ${g}, ${b})`}
        />
    )
}
