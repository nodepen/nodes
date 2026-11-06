import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { COLORS } from '@/constants'
import { usePageSpaceToOverlaySpace } from '@/hooks'
import { usePresenceSelectionColor } from '@/hooks/usePresenceSelectionColor'
import { useSelectionColor } from '@/hooks/useSelectionColor'
import { useNodeInternalState } from '../../context/node-state'
import { useIsEditable } from '@/hooks/useIsEditable'
import { useRightClick } from '@/hooks/useRightClick'
import { getLeftRoundedRectanglePath } from '@/utils/geometry'

type ExpressionBodyProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
    onDoubleClick: (e: React.MouseEvent<SVGGElement>) => void
    onPointerDownCapture: (e: React.PointerEvent<SVGGElement>) => void
}

export const ExpressionBody = ({ node, template, onDoubleClick, onPointerDownCapture }: ExpressionBodyProps) => {
    const { position } = useNodeInternalState()

    const isEditable = useIsEditable()

    const { sessionColor, presenceColor } = useSelectionColor(node.instanceId)

    const { apply } = useDispatch()

    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const nodeWidth = node.dimensions.width
    const nodeHeight = node.dimensions.height

    const hasOutputs = Object.keys(node.outputs).length > 0

    const handleContextMenu = useCallback((e: PointerEvent): void => {
        e.stopPropagation()
        e.preventDefault()

        if (!isEditable) {
            return
        }

        const { pageX, pageY } = e

        const key = `node-context-menu-${node.instanceId}`

        const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

        apply((state) => {
            state.registry.contextMenus[key] = {
                position: {
                    x,
                    y,
                },
                context: {
                    type: 'node',
                    nodeInstanceId: node.instanceId,
                    nodeTemplate: template,
                },
            }
        })
    }, [])

    const rightClickRef = useRightClick<SVGGElement>(handleContextMenu, true)

    const o = 4

    return (
        <g id={`expression-body-${node.instanceId}`} ref={rightClickRef} onDoubleClick={onDoubleClick} onPointerDownCapture={onPointerDownCapture}>
            {hasOutputs ? (
                <rect
                    x={position.x}
                    y={position.y}
                    width={nodeWidth}
                    height={nodeHeight}
                    rx={7}
                    ry={7}
                    fill={sessionColor}
                    stroke={COLORS.DARK}
                    strokeWidth={2}
                    pointerEvents="auto"
                />
            ) : (
                <path
                    d={getLeftRoundedRectanglePath(position.x, position.y, nodeWidth, nodeHeight, 7)}
                    fill={sessionColor}
                    stroke={COLORS.DARK}
                    strokeWidth={2}
                    pointerEvents="auto"
                />
            )}
            {presenceColor ? (
                <rect
                    x={position.x + o}
                    y={position.y + o}
                    width={nodeWidth - (o * 2)}
                    height={nodeHeight - (o * 2)}
                    fill={presenceColor}
                    rx={5}
                    ry={5}
                    pointerEvents={"auto"}
                />
            ) : null}
        </g>
    )
}
