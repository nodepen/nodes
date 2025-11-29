import React from 'react'
import type { ContextMenu } from '../../types'
import type { NodeContextMenuContext } from '../../types/ContextMenuContext'
import { MenuBody, MenuHeader } from '../../common'
import { getIconAsImage } from '@/utils/templates'
import { DisableButton } from './buttons'

type NodeContextMenuProps = {
  position: ContextMenu['position']
  context: NodeContextMenuContext
}

export const NodeContextMenu = ({ position, context }: NodeContextMenuProps) => {
  const { nodeInstanceId, nodeTemplate } = context
  const { name } = nodeTemplate

  const menuIcon = (
    <img
      width={20}
      height={20}
      src={getIconAsImage(nodeTemplate)}
      alt={`${nodeTemplate.name} (${nodeTemplate.nickName}): ${nodeTemplate.description}`}
    />
  )

  return (
    <MenuBody position={position}>
      <MenuHeader icon={menuIcon} label={name} />
      <DisableButton nodeInstanceId={nodeInstanceId} />
    </MenuBody>
  )
}
