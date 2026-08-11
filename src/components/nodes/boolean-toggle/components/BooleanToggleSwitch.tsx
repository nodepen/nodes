import type React from 'react'
import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'
import { useDraggableNode, useSelectableNode } from '../../hooks'

const { NODE_INTERNAL_PADDING, BOOLEAN_TOGGLE_SWITCH_SIZE } = DIMENSIONS

type BooleanToggleSwitchProps = {
    node: NodePen.DocumentNode
    onClick: (e: React.MouseEvent<SVGGElement>) => void
}

export const BooleanToggleSwitch = ({ node, onClick }: BooleanToggleSwitchProps) => {
    const { position } = useNodeInternalState()

    const { dimensions, instanceId: id } = node
    const { value } = node.nodeConfiguration as NodePen.BooleanToggleConfig

    const size = BOOLEAN_TOGGLE_SWITCH_SIZE
    const x = position.x + dimensions.width - (NODE_INTERNAL_PADDING * 2) - size
    const y = position.y + (dimensions.height - size) / 2

    const draggableRef = useDraggableNode(node.instanceId)
    const selectableRef = useSelectableNode(node.instanceId)

    return (
        <g id={`boolean-toggle-switch-${id}`} style={{ pointerEvents: 'all' }} onClick={onClick}>
            <g ref={draggableRef}>
                <g ref={selectableRef}>
                    <rect
                        className="hover:np-cursor-pointer"
                        x={x}
                        y={y}
                        width={size}
                        height={size}
                        rx={4}
                        ry={4}
                        fill={COLORS.LIGHT}
                        stroke={COLORS.DARK}
                        strokeWidth={2}
                    />
                    {value ? (
                        <polyline
                            className="np-pointer-events-none"
                            points={`${x + size * 0.22},${y + size * 0.55} ${x + size * 0.42},${y + size * 0.75} ${x + size * 0.8},${y + size * 0.25}`}
                            fill="none"
                            stroke={COLORS.DARK}
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ) : null}
                </g>
            </g>
        </g>
    )
}
