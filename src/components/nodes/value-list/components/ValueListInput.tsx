import type React from 'react'
import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'
import { useDraggableNode, useSelectableNode } from '../../hooks'

const { NODE_INTERNAL_PADDING, NODE_LABEL_FONT_SIZE } = DIMENSIONS

type ValueListInputProps = {
    node: NodePen.DocumentNode
    onClick: (e: React.MouseEvent<SVGGElement>) => void
}

export const ValueListInput = ({ node, onClick }: ValueListInputProps) => {
    const { position } = useNodeInternalState()

    const { dimensions, instanceId: id } = node
    const { items } = node.nodeConfiguration as NodePen.ValueListConfig

    const currentLabel = items.find((item) => item.isSelected)?.name ?? ''

    const x = position.x + NODE_INTERNAL_PADDING
    const y = position.y + NODE_INTERNAL_PADDING
    const width = dimensions.width - NODE_INTERNAL_PADDING * 2
    const height = dimensions.height - NODE_INTERNAL_PADDING * 2

    const caretWidth = 12
    const caretHeight = 8
    const caretCenter = {
        x: x + width - NODE_INTERNAL_PADDING * 3,
        y: y + height / 2
    }

    const draggableRef = useDraggableNode(node.instanceId)
    const selectableRef = useSelectableNode(node.instanceId)

    return (
        <g id={`value-list-input-${id}`} style={{ pointerEvents: 'all' }} onClick={onClick}>
            <g ref={draggableRef}>
                <g ref={selectableRef}>
                    <rect
                        className="hover:np-fill-grey np-fill-none hover:np-cursor-pointer"
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx={4}
                        ry={4}
                    />
                    <path
                        id={`value-list-input-path-${id}`}
                        className='np-pointer-events-none'
                        fill="none"
                        d={`M ${x + NODE_INTERNAL_PADDING} ${y + height / 2} L ${caretCenter.x - caretWidth} ${y + height / 2}`}
                    />
                    <text
                        className="np-font-panel np-select-none np-pointer-events-none"
                        fill={COLORS.DARK}
                        fontSize={NODE_LABEL_FONT_SIZE}
                        dominantBaseline="middle"
                    >
                        <textPath href={`#value-list-input-path-${id}`} startOffset="0%" textAnchor="start">
                            {currentLabel}
                        </textPath>
                    </text>
                    <polygon
                        className="np-pointer-events-none"
                        points={`${caretCenter.x - caretWidth / 2},${caretCenter.y - caretHeight / 3} ${caretCenter.x + caretWidth / 2},${caretCenter.y - caretHeight / 3} ${caretCenter.x},${caretCenter.y + caretHeight / 3}`}
                        fill={COLORS.DARK}
                        stroke={COLORS.DARK}
                        strokeWidth={2}
                        strokeLinejoin="round"
                    />
                </g>
            </g>
        </g>
    )
}
