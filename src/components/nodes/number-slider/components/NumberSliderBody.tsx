import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { COLORS } from '@/constants'
import { useSelectionColor } from '@/hooks/useSelectionColor'
import { useNodeInternalState } from '../../context/node-state'

type NumberSliderBodyProps = {
    node: NodePen.DocumentNode
}

export const NumberSliderBody = ({ node }: NumberSliderBodyProps) => {
    const { position } = useNodeInternalState()

    const { width, height } = node.dimensions

    const fill = useSelectionColor(node.instanceId)

    return (
        <g id={`number-slider-body-${node.instanceId}`}>
            <rect
                x={position.x}
                y={position.y}
                width={width}
                height={height}
                rx={7}
                ry={7}
                fill={fill}
                stroke={COLORS.DARK}
                strokeWidth={2}
                pointerEvents="auto"
            />
        </g>
    )
}