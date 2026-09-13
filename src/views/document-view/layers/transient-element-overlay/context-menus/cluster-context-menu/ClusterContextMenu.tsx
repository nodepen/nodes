import React from 'react'
import { useStore } from '$'
import type { ContextMenu } from '../../types'
import type { ClusterContextMenuContext } from '../../types/ContextMenuContext'
import { MenuBody, MenuDivider } from '../../common'
import { EditClusterButton, ViewClusterButton } from './buttons'

type ClusterContextMenuProps = {
    position: ContextMenu['position']
    context: ClusterContextMenuContext
}

export const ClusterContextMenu = ({ position, context }: ClusterContextMenuProps) => {
    const { clusterId } = context

    const hasRef = useStore((state) => state.document.clusters[clusterId]?.ref !== null)

    return (
        <MenuBody position={position}>
            <EditClusterButton clusterId={clusterId} />
            {hasRef && (
                <>
                    <MenuDivider />
                    <ViewClusterButton clusterId={clusterId} />
                </>
            )}
        </MenuBody>
    )
}
