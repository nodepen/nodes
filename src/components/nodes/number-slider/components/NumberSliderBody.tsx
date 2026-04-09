import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { COLORS } from '@/constants'

type NumberSliderBodyProps = {
    node: NodePen.DocumentNode
}

export const NumberSliderBody = ({ node }: NumberSliderBodyProps) => {
    const { position } = node
    const { width, height } = node.dimensions

    const documentSelection = useStore((state) => state.registry.selection.nodes)
    const isSelected = documentSelection.includes(node.instanceId)

    return (
        <g id={`number-slider-body-${node.instanceId}`}>
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