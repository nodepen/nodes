import React, { useCallback } from 'react'
import type { ContextMenu } from '../../types'
import type { DocumentCanvasContextMenuContext } from '../../types/ContextMenuContext'
import { MenuBody, MenuDivider } from '../../common'
import { CreateClusterButton, ShowSelectionButton, HideSelectionButton } from './buttons'
import { useDispatch } from '@/store'
import { addDocumentNode, expireSolution } from '@/store/utils'
import { clearMenus } from '@/store/utils/clearMenus'
import { createEmptyCluster } from '@/utils/clusters'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'

type Props = {
    position: ContextMenu['position']
    context: DocumentCanvasContextMenuContext
}

export const DocumentCanvasContextMenu = ({ position, context }: Props) => {
    const { apply } = useDispatch()

    const enableClusters = useFeatureFlag('enableClusters')

    const handleClick = useCallback(() => {
        const { cluster, node } = createEmptyCluster()

        apply((state) => {
            const center = context.position

            node.position = {
                x: center.x - node.dimensions.width / 2,
                y: center.y - node.dimensions.height / 2,
            }

            addDocumentNode(state, node)

            state.document.clusters[cluster.instanceId] = cluster

            clearMenus(state)

            expireSolution(state)
        })
    }, [])

    return (
        <MenuBody position={position}>
            <ShowSelectionButton />
            <HideSelectionButton />
            {enableClusters && (<>
                <MenuDivider />
                <CreateClusterButton onClick={handleClick} />
            </>)}
        </MenuBody>
    )
}
