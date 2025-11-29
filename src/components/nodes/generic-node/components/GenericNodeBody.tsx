import React, { useCallback } from 'react'
import type * as NodePen from '@nodepen/core'
import { useDispatch, useStore } from '$'
import { COLORS } from '@/constants'
import { usePageSpaceToOverlaySpace } from '@/hooks'
import { GenericNodeLabel } from '.'

type GenericNodeBodyProps = {
  node: NodePen.DocumentNode
  template: NodePen.NodeTemplate
}

export const GenericNodeBody = ({ node, template }: GenericNodeBodyProps) => {
  const { position } = node

  const nodeWidth = node.dimensions.width
  const nodeHeight = node.dimensions.height

  const { apply } = useDispatch()
  const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

  const documentSelection = useStore((state) => state.registry.selection.nodes)
  const isSelected = documentSelection.includes(node.instanceId)

  const handleContextMenu = useCallback((e: React.MouseEvent<SVGGElement>): void => {
    e.stopPropagation()
    e.preventDefault()

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

  return (
    <g id={`generic-node-body-${node.instanceId}`} onContextMenu={handleContextMenu}>
      <rect
        x={position.x}
        y={position.y}
        width={nodeWidth}
        height={nodeHeight}
        rx={7}
        ry={7}
        fill={isSelected ? COLORS.GREEN : COLORS.LIGHT}
        stroke={COLORS.DARK}
        strokeWidth={2}
        pointerEvents="auto"
      />
      <GenericNodeLabel node={node} template={template} />
    </g>
  )
}
