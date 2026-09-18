import React from 'react'
import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'
import { getClusterByNodeInstanceId } from '@/utils/clusters/getClusterForNode'
import { useStore } from '$'

const { CLUSTER_PREVIEW_WIDTH, CLUSTER_PREVIEW_HEIGHT } = DIMENSIONS

type ClusterPreviewProps = {
    node: NodePen.DocumentNode
}

export const ClusterPreview = ({ node }: ClusterPreviewProps) => {
    const { position } = useNodeInternalState()

    const cluster = useStore((state) => getClusterByNodeInstanceId(state.document, node.instanceId))
    const previewUrl = cluster?.cluster.meta?.documentThumbnailUrl

    const { anchors } = node
    const { dx } = anchors['labelDeltaX']

    const nodeHeight = node.dimensions.height

    const previewX = position.x + dx - CLUSTER_PREVIEW_WIDTH / 2
    const previewY = position.y + (nodeHeight - CLUSTER_PREVIEW_HEIGHT) / 2

    const clipId = `cluster-preview-clip-${node.instanceId}`

    return (
        <>
            <rect
                x={previewX}
                y={previewY}
                width={CLUSTER_PREVIEW_WIDTH}
                height={CLUSTER_PREVIEW_HEIGHT}
                rx={7}
                ry={7}
                fill={COLORS.PALE}
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
            {previewUrl ? (
                <>
                    <clipPath id={clipId}>
                        <rect x={previewX} y={previewY} width={CLUSTER_PREVIEW_WIDTH} height={CLUSTER_PREVIEW_HEIGHT} rx={7} ry={7} />
                    </clipPath>
                    <image
                        href={previewUrl}
                        x={previewX}
                        y={previewY}
                        width={CLUSTER_PREVIEW_WIDTH}
                        height={CLUSTER_PREVIEW_HEIGHT}
                        preserveAspectRatio="xMidYMid slice"
                        clipPath={`url(#${clipId})`}
                        className="np-pointer-events-none np-select-none"
                    />
                    <rect
                        x={position.x + dx - CLUSTER_PREVIEW_WIDTH / 2}
                        y={position.y + 1 + (nodeHeight - CLUSTER_PREVIEW_HEIGHT) / 2}
                        width={CLUSTER_PREVIEW_WIDTH}
                        height={CLUSTER_PREVIEW_HEIGHT - 1}
                        rx={7}
                        ry={7}
                        stroke={COLORS.PALE}
                        strokeWidth={6}
                        fill="none"
                        clipPath={`url(#${clipId})`}
                    />
                </>
            ) : null}
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
        </>
    )
}
