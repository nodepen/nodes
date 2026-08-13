import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { COLORS } from '@/constants'
import { usePageSpaceToOverlaySpace } from '@/hooks'
import { GenericNodeLabel } from '.'
import { usePresenceSelectionColor } from '@/hooks/usePresenceSelectionColor'
import { useSelectionColor } from '@/hooks/useSelectionColor'
import { useNodeInternalState } from '../../context/node-state'
import { useIsEditable } from '@/hooks/useIsEditable'

type GenericNodeBodyProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GenericNodeBody = ({ node, template }: GenericNodeBodyProps) => {
    const { position } = useNodeInternalState()

    const isEditable = useIsEditable()

    const { sessionColor, presenceColor } = useSelectionColor(node.instanceId)

    const { apply } = useDispatch()

    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const nodeWidth = node.dimensions.width
    const nodeHeight = node.dimensions.height

    const handleContextMenu = useCallback((e: React.MouseEvent<SVGGElement>): void => {
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

    const o = 4

    return (
        <g id={`generic-node-body-${node.instanceId}`} onContextMenu={handleContextMenu}>
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
            <GenericNodeLabel node={node} template={template} />
        </g>
    )
}
