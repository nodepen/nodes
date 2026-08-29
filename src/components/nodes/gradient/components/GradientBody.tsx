import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useDispatch } from '$'
import { COLORS } from '@/constants'
import { usePageSpaceToOverlaySpace } from '@/hooks'
import { useSelectionColor } from '@/hooks/useSelectionColor'
import { useNodeInternalState } from '../../context/node-state'
import { useIsEditable } from '@/hooks/useIsEditable'
import { useRightClick } from '@/hooks/useRightClick'

type GradientBodyProps = {
    node: NodePen.DocumentNode
    onDoubleClick: (e: React.MouseEvent<SVGGElement>) => void
}

/** TODO */
export const GradientBody = ({ node, onDoubleClick }: GradientBodyProps) => {
    const { position } = useNodeInternalState()

    const isEditable = useIsEditable()

    const { width, height } = node.dimensions

    const { sessionColor, presenceColor } = useSelectionColor(node.instanceId)

    const { apply } = useDispatch()
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const handleContextMenu = useCallback((e: PointerEvent): void => {
        e.stopPropagation()
        e.preventDefault()

        if (!isEditable) {
            return
        }

        const { pageX, pageY } = e

        const key = `gradient-menu-${node.instanceId}`

        const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

        apply((state) => {
            state.registry.contextMenus[key] = {
                position: { x, y },
                context: {
                    type: 'gradient',
                    nodeInstanceId: node.instanceId,
                }
            }
        })
    }, [isEditable, pageSpaceToOverlaySpace, node.instanceId])

    const rightClickRef = useRightClick(handleContextMenu, true)

    return (
        <g id={`gradient-body-${node.instanceId}`} ref={rightClickRef} onDoubleClick={onDoubleClick}>
            <rect
                x={position.x}
                y={position.y}
                width={width}
                height={height}
                rx={7}
                ry={7}
                fill={presenceColor ?? sessionColor}
                stroke={COLORS.DARK}
                strokeWidth={2}
                pointerEvents="auto"
            />
        </g>
    )
}
