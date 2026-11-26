import type React from 'react'
import type * as NodePen from '@/types'
import { COLORS } from '@/constants'
import { getGradientControlAreaExtents } from '@/utils/node-dimensions/getGradientDimensions'
import { useNodeInternalState } from '../../context/node-state'
import { useDraggableNode, useSelectableNode } from '../../hooks'
import { useIsEditable } from '@/hooks/useIsEditable'
import { useDoubleClick } from '@/hooks/useDoubleClick'

/** Insets of the gradient preview from the edges of the control area. */
const GRADIENT_PREVIEW_INSET_X = 3
const GRADIENT_PREVIEW_INSET_TOP = 4
const GRADIENT_PREVIEW_INSET_BOTTOM = 2

type GradientControlAreaProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
    config?: NodePen.GradientConfig
    onClick: (e: React.MouseEvent<SVGGElement>) => void
    onDoubleClick: () => void
}

const toRgb = ({ r, g, b }: NodePen.GradientGripColor): string => `rgb(${r}, ${g}, ${b})`

export const GradientControlArea = ({ node, template, config, onClick, onDoubleClick }: GradientControlAreaProps) => {
    const { position } = useNodeInternalState()

    const isEditable = useIsEditable()

    const draggableRef = useDraggableNode(node.instanceId)
    const selectableRef = useSelectableNode(node.instanceId)

    const doubleClickRef = useDoubleClick<SVGGElement>(onDoubleClick)

    const { x, y, width, height } = getGradientControlAreaExtents(node, template, position)

    const gradientId = `gradient-preview-fill-${node.instanceId}`

    const grips = [...(config?.grips ?? [])].sort((a, b) => a.position - b.position)

    const previewWidth = width - GRADIENT_PREVIEW_INSET_X * 2
    const previewHeight = height - GRADIENT_PREVIEW_INSET_TOP - GRADIENT_PREVIEW_INSET_BOTTOM

    return (
        <g
            id={`gradient-control-area-${node.instanceId}`}
            style={{ pointerEvents: 'all' }}
            onClick={onClick}
        >
            <g ref={draggableRef}>
                <g ref={selectableRef}>
                    <g ref={doubleClickRef} className={isEditable ? 'np-group hover:np-cursor-pointer' : ''}>
                        <rect x={x} y={y} width={width} height={height} rx={4} ry={4} stroke={COLORS.DARK} strokeWidth={2} className={isEditable ? 'group-hover:np-fill-grey' : ''} fill={COLORS.LIGHT} />
                        <rect x={x} y={y + 1} width={width} height={height} rx={4} ry={4} stroke={COLORS.DARK} strokeWidth={2} className={isEditable ? 'group-hover:np-fill-grey' : ''} fill={COLORS.LIGHT} />
                        {grips.length > 0 && previewWidth > 0 && previewHeight > 0 ? (<>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                                    {grips.flatMap((grip, i) => {
                                        const offset = Math.min(Math.max(grip.position, 0), 1)
                                        return [
                                            <stop key={`${i}-l`} offset={offset} stopColor={toRgb(grip.colorLeft)} />,
                                            <stop key={`${i}-r`} offset={offset} stopColor={toRgb(grip.colorRight)} />,
                                        ]
                                    })}
                                </linearGradient>
                            </defs>
                            <rect
                                className={`np-pointer-events-none ${isEditable ? 'group-hover:np-opacity-75' : ''}`}
                                x={x + GRADIENT_PREVIEW_INSET_X}
                                y={y + GRADIENT_PREVIEW_INSET_TOP}
                                width={previewWidth}
                                height={previewHeight}
                                rx={2}
                                ry={2}
                                fill={`url(#${gradientId})`}
                            />
                        </>) : null}
                    </g>
                </g>
            </g>
        </g>
    )
}
