import React from 'react'
import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'
import { AnnotationsUnderlayPortal } from '@/components/annotations'

const { NODE_VALUE_FONT_SIZE } = DIMENSIONS

const TOGGLE_LABEL_EXTRA_HEIGHT = 32

type GenericNodeToggleLabelProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GenericNodeToggleLabel = ({ node, template }: GenericNodeToggleLabelProps) => {
    const { position } = useNodeInternalState()

    const config = node.nodeConfiguration as NodePen.GenericConfiguration | undefined

    const selectedLabel = template.toggles
        .flatMap((group) => group.items)
        .find((item) => config?.toggles?.[item.value] === true)?.label

    if (!selectedLabel) {
        return null
    }

    const nodeWidth = node.dimensions.width
    const nodeHeight = node.dimensions.height

    const centerX = position.x + nodeWidth / 2
    const centerY = position.y + nodeHeight + TOGGLE_LABEL_EXTRA_HEIGHT / 2

    return (
        <AnnotationsUnderlayPortal>
            <rect
                x={position.x}
                y={position.y}
                width={nodeWidth}
                height={nodeHeight + TOGGLE_LABEL_EXTRA_HEIGHT}
                rx={7}
                ry={7}
                fill={COLORS.PALE}
                stroke="none"
            />
            <text
                className="np-font-sans np-select-none np-pointer-events-none"
                x={centerX}
                y={centerY + 1}
                dominantBaseline="middle"
                textAnchor="middle"
                fill={COLORS.DARK}
                fontSize={NODE_VALUE_FONT_SIZE}
            >
                {selectedLabel}
            </text>
        </AnnotationsUnderlayPortal>
    )
}
