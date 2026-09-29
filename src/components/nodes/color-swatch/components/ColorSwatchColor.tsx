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

    const radius = Math.min(width, height) / 2

    return (
        <circle
            className="np-pointer-events-none"
            cx={position.x + width - radius}
            cy={position.y + height / 2}
            r={radius - NODE_INTERNAL_PADDING}
            fill={`rgb(${r}, ${g}, ${b})`}
        />
    )
}
