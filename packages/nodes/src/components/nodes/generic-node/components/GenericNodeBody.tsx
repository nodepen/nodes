import React, { useCallback } from 'react'
import type * as NodePen from '@nodepen/core'
import { useDispatch, useStore } from '$'
import { COLORS } from '@/constants'
import { getNodeWidth, getNodeHeight } from '@/utils/node-dimensions'
import { usePageSpaceToOverlaySpace } from '@/hooks'

type GenericNodeBodyProps = {
  node: NodePen.DocumentNode
  template: NodePen.NodeTemplate
}

export const GenericNodeBody = ({ node, template }: GenericNodeBodyProps) => {
  const { position } = node

  const nodeWidth = getNodeWidth()
  const nodeHeight = getNodeHeight(template)

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
      onContextMenu={handleContextMenu}
    />
  )
}
