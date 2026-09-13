import React from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'
import { getClusterByNodeInstanceId } from '@/utils/clusters/getClusterForNode'
import { AnnotationsUnderlayPortal } from '@/components/annotations'

const { NODE_VALUE_FONT_SIZE } = DIMENSIONS

const CLUSTER_LABEL_EXTRA_HEIGHT = 32
const CLUSTER_LABEL_PADDING_X = 8

type ClusterLabelProps = {
    node: NodePen.DocumentNode
}

export const ClusterLabel = ({ node }: ClusterLabelProps) => {
    const { position } = useNodeInternalState()

    const cluster = useStore((store) => getClusterByNodeInstanceId(store.document, node.instanceId)?.cluster ?? null)

    const nodeWidth = node.dimensions.width
    const nodeHeight = node.dimensions.height

    const name = cluster?.ref ? cluster.meta?.documentName ?? '' : 'Empty Cluster'
    const versionLabel = cluster?.ref && cluster.meta ? `R${String(cluster.meta.documentVersionIndex).padStart(3, '0')}` : ''

    const centerY = position.y + nodeHeight + CLUSTER_LABEL_EXTRA_HEIGHT / 2

    return (
        <>
            <AnnotationsUnderlayPortal>
                <rect
                    x={position.x}
                    y={position.y}
                    width={nodeWidth}
                    height={nodeHeight + CLUSTER_LABEL_EXTRA_HEIGHT}
                    rx={7}
                    ry={7}
                    fill={COLORS.PALE}
                    stroke="none"
                />
                <text
                    className="np-font-sans np-select-none np-pointer-events-none"
                    x={position.x + CLUSTER_LABEL_PADDING_X}
                    y={centerY + 1}
                    dominantBaseline="middle"
                    textAnchor="start"
                    fill={COLORS.DARK}
                    fontSize={NODE_VALUE_FONT_SIZE}
                >
                    {name}
                </text>
                {versionLabel ? (
                    <text
                        className="np-font-sans np-select-none np-pointer-events-none"
                        x={position.x + nodeWidth - CLUSTER_LABEL_PADDING_X}
                        y={centerY}
                        dominantBaseline="middle"
                        textAnchor="end"
                        fill={COLORS.DARK}
                        fontSize={NODE_VALUE_FONT_SIZE}
                    >
                        {versionLabel}
                    </text>
                ) : null}
            </AnnotationsUnderlayPortal>
        </>
    )
}
