import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { COLORS } from '@/constants'
import { usePageSpaceToOverlaySpace } from '@/hooks'
import { useSelectionColor } from '@/hooks/useSelectionColor'
import { useNodeInternalState } from '../../context/node-state'
import { useIsEditable } from '@/hooks/useIsEditable'
import { useRightClick } from '@/hooks/useRightClick'
import { getClusterByNodeInstanceId } from '@/utils/clusters/getClusterForNode'
import { ClusterPreview } from './ClusterPreview'

type ClusterBodyProps = {
    node: NodePen.DocumentNode
}

export const ClusterBody = ({ node }: ClusterBodyProps) => {
    const { position } = useNodeInternalState()

    const isEditable = useIsEditable()

    const { sessionColor, presenceColor } = useSelectionColor(node.instanceId)

    const label = useStore((store) => getClusterByNodeInstanceId(store.document, node.instanceId)?.cluster.meta?.documentName ?? 'Cluster')

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

        const found = getClusterByNodeInstanceId(useStore.getState().document, node.instanceId)

        if (!found) {
            console.log(`🐍 Could not find document.clusters entry for cluster node [${node.instanceId}]`)
            return
        }

        const { pageX, pageY } = e

        const key = `cluster-context-menu-${found.clusterId}`

        const [x, y] = pageSpaceToOverlaySpace(pageX + 6, pageY + 6)

        apply((state) => {
            state.registry.contextMenus[key] = {
                position: {
                    x,
                    y,
                },
                context: {
                    type: 'cluster',
                    clusterId: found.clusterId,
                },
            }
        })
    }, [node.instanceId, isEditable])

    const rightClickRef = useRightClick(handleContextMenu, true)

    const o = 4

    return (
        <g id={`cluster-body-${node.instanceId}`} ref={rightClickRef}>
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
            <ClusterPreview node={node} />
        </g>
    )
}
