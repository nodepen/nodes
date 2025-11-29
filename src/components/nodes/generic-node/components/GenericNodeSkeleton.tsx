import React, { useMemo } from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'
import { getRoundedRectangleDash } from '@/utils/geometry'
import { COLORS } from '@/constants'
import { useReducedMotion } from '@/hooks'

type GenericNodeSkeletonProps = {
  node: NodePen.DocumentNode
  template: NodePen.NodeTemplate
}

export const GenericNodeSkeleton = ({ node, template }: GenericNodeSkeletonProps) => {
  const { position } = node

  const currentZoom = useStore((state) => state.camera.zoom)

  const prefersReducedMotion = useReducedMotion()

  const nodeWidth = node.dimensions.width
  const nodeHeight = node.dimensions.height

  const NODE_CORNER_RADIUS = 7

  const { strokeDasharray, strokeDashoffset } = getRoundedRectangleDash(
    9,
    6,
    nodeWidth,
    nodeHeight,
    NODE_CORNER_RADIUS,
    currentZoom
  )

  return (
    <rect
      className={prefersReducedMotion ? '' : 'np-animate-march'}
      x={position.x}
      y={position.y}
      width={nodeWidth}
      height={nodeHeight}
      rx={NODE_CORNER_RADIUS}
      ry={NODE_CORNER_RADIUS}
      fill="none"
      stroke={COLORS.DARK}
      strokeWidth={2}
      pointerEvents="none"
      vectorEffect="non-scaling-stroke"
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
    />
  )
}
