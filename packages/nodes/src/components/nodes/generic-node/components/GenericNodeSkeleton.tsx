import React, { useMemo } from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'
import { getNodeHeight, getNodeWidth } from '@/utils/node-dimensions'
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

    const nodeWidth = useMemo(() => getNodeWidth(), [])
    const nodeHeight = useMemo(() => getNodeHeight(template), [template])

    const NODE_CORNER_RADIUS = 7

    const pathLength = [
        2 * Math.PI * NODE_CORNER_RADIUS,
        2 * (nodeHeight - (2 * NODE_CORNER_RADIUS)),
        2 * (nodeWidth - (2 * NODE_CORNER_RADIUS))
    ].reduce((partial, value) => value + partial, 0) * currentZoom

    const NODE_TARGET_DASH = 15

    const dashSegmentCount = Math.floor(pathLength / NODE_TARGET_DASH)
    const dashSegmentOverflow = pathLength % dashSegmentCount

    const dashSegmentLength = NODE_TARGET_DASH + (dashSegmentOverflow / dashSegmentCount)

    const dashSegmentFraction = dashSegmentLength / NODE_TARGET_DASH
    const dashSegmentDash = dashSegmentFraction * 9
    const dashSegmentGap = dashSegmentFraction * 6

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
            strokeDasharray={`${dashSegmentDash} ${dashSegmentGap}`}
            strokeDashoffset={`${dashSegmentLength}`}
        />
    )
}