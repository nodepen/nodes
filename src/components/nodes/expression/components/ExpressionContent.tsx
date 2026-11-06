import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'
import { useIsEditable } from '@/hooks/useIsEditable'

const { NODE_INTERNAL_PADDING, EXPRESSION_CONTENT_WIDTH, EXPRESSION_CONTENT_HEIGHT, EXPRESSION_FONT_SIZE } = DIMENSIONS

// monospace estimate
const CHARACTER_WIDTH = EXPRESSION_FONT_SIZE * 0.6

type ExpressionContentProps = {
    node: NodePen.DocumentNode
    onClick: () => void
}

export const ExpressionContent = ({ node, onClick }: ExpressionContentProps) => {
    const { position } = useNodeInternalState()

    const isEditable = useIsEditable()

    const expression = useStore((state) => {
        const config = state.document.nodes[node.instanceId]?.nodeConfiguration as NodePen.ExpressionConfig | undefined
        return config?.expression ?? ''
    })

    const dx = useStore((state) => state.document.nodes[node.instanceId]?.anchors.labelDeltaX.dx ?? 0)
    const nodeHeight = useStore((state) => state.document.nodes[node.instanceId]?.dimensions.height ?? 0)

    const width = EXPRESSION_CONTENT_WIDTH
    const height = EXPRESSION_CONTENT_HEIGHT
    const x = position.x + dx - width / 2
    const y = position.y + nodeHeight / 2 - height / 2

    const maxCharacters = Math.floor((width - NODE_INTERNAL_PADDING * 4) / CHARACTER_WIDTH)
    const displayText = expression.length > maxCharacters ? `${expression.slice(0, maxCharacters - 1)}…` : expression

    const handlePointerDown = useCallback((e: React.PointerEvent<SVGRectElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()

        if (!isEditable) {
            return
        }

        switch (e.pointerType) {
            case 'mouse': {
                onClick()
                break
            }
            case 'pen':
            case 'touch': {
                break
            }
        }
    }, [isEditable, onClick])

    return (
        <g id={`expression-content-${node.instanceId}`}>
            <rect x={x} y={y} width={width} height={height} rx={4} ry={4} stroke={COLORS.DARK} strokeWidth={2} fill={COLORS.LIGHT} />
            <rect
                x={x}
                y={y + 1}
                width={width}
                height={height}
                rx={4}
                ry={4}
                stroke={COLORS.DARK}
                strokeWidth={2}
                fill={COLORS.LIGHT}
                className={`${isEditable ? 'hover:cursor-pointer hover:np-fill-grey' : ''}`}
                onPointerDown={handlePointerDown}
            />
            <text
                x={x + width / 2}
                y={y + height / 2 + 1}
                textAnchor="middle"
                dominantBaseline="central"
                className="np-font-panel np-font-[800] np-select-none np-pointer-events-none"
                fill={COLORS.DARK}
                fontSize={EXPRESSION_FONT_SIZE}
            >
                {displayText}
            </text>
        </g>
    )
}
