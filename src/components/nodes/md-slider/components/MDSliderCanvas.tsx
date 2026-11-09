import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'

const { NODE_INTERNAL_PADDING } = DIMENSIONS

export type MDSliderPoint = {
    x: number
    y: number
}

export type MDSliderDomains = Pick<NodePen.MDSliderConfig, 'x' | 'y'>

type MDSliderCanvasProps = {
    node: NodePen.DocumentNode
    value: MDSliderPoint
    domains: MDSliderDomains
    onChange: (next: MDSliderPoint) => void
    onCommit: (next: MDSliderPoint) => void
}

export const MDSliderCanvas = ({ node }: MDSliderCanvasProps) => {
    const { position } = useNodeInternalState()

    const { width, height } = node.dimensions

    const offset = 2 * NODE_INTERNAL_PADDING

    return (
        <g id={`md-slider-canvas-${node.instanceId}`}>
            <rect
                x={position.x + offset}
                y={position.y + offset}
                width={width - 2 * offset}
                height={height - 2 * offset}
                fill="none"
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
            {/* TODO: The interactive part. */}
        </g>
    )
}
