import React from 'react'
import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'

const { CLUSTER_PREVIEW_WIDTH, CLUSTER_PREVIEW_HEIGHT } = DIMENSIONS

type ClusterPreviewProps = {
    node: NodePen.DocumentNode
}

export const ClusterPreview = ({ node }: ClusterPreviewProps) => {
    const { position } = useNodeInternalState()

    const { anchors } = node
    const { dx } = anchors['labelDeltaX']

    const nodeHeight = node.dimensions.height

    return (
        <>
            <rect
                x={position.x + dx - CLUSTER_PREVIEW_WIDTH / 2}
                y={position.y + (nodeHeight - CLUSTER_PREVIEW_HEIGHT) / 2}
                width={CLUSTER_PREVIEW_WIDTH}
                height={CLUSTER_PREVIEW_HEIGHT}
                rx={7}
                ry={7}
                fill={COLORS.PALE}
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
            <rect
                x={position.x + dx - CLUSTER_PREVIEW_WIDTH / 2}
                y={position.y + 1 + (nodeHeight - CLUSTER_PREVIEW_HEIGHT) / 2}
                width={CLUSTER_PREVIEW_WIDTH}
                height={CLUSTER_PREVIEW_HEIGHT - 1}
                rx={7}
                ry={7}
                fill="none"
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
            <rect
                x={position.x + dx - CLUSTER_PREVIEW_WIDTH / 2}
                y={position.y + 2 + (nodeHeight - CLUSTER_PREVIEW_HEIGHT) / 2}
                width={CLUSTER_PREVIEW_WIDTH}
                height={CLUSTER_PREVIEW_HEIGHT - 2}
                rx={7}
                ry={7}
                fill="none"
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
        </>
    )
}
