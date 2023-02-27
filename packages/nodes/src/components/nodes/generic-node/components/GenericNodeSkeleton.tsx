import React, { useMemo } from 'react'
import type * as NodePen from '@nodepen/core'
import { getNodeHeight, getNodeWidth } from '@/utils/node-dimensions'
import { COLORS } from '@/constants'

type GenericNodeSkeletonProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GenericNodeSkeleton = ({ node, template }: GenericNodeSkeletonProps) => {
    const { position } = node

    const nodeWidth = useMemo(() => getNodeWidth(), [])
    const nodeHeight = useMemo(() => getNodeHeight(template), [template])

    return (
        <rect
            className='np-animate-march '
            x={position.x}
            y={position.y}
            width={nodeWidth}
            height={nodeHeight}
            rx={7}
            ry={7}
            fill="none"
            stroke={COLORS.DARK}
            strokeWidth={2}
            pointerEvents="none"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={"9 6"}
            strokeDashoffset={"15"}
        />
    )
}