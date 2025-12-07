import React, { useCallback } from 'react'
import type { ContextMenu, PortContextMenuContext } from '../../types'
import { MenuBody, MenuDivider, MenuHeader } from '../../common'
import { PortTypeIcon } from '@/components/icons'
import { FlattenButton, GraftButton, PinButton, SetValueButton, SimplifyButton } from './buttons'
import { getPortContextMenuButtons } from './utils'
import { useDispatch, useStore } from '$'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { DIMENSIONS } from '@/constants'

type PortContextMenuProps = {
  position: ContextMenu['position']
  context: PortContextMenuContext
}

const PortContextMenu = ({ position, context }: PortContextMenuProps) => {
  const { nodeInstanceId, portInstanceId, portTemplate } = context
  const { name, nickName } = portTemplate

  const nodeTemplate = useStore.getState().templates[useStore.getState().document.nodes[nodeInstanceId].templateId]
  const nodeType = getNodeTypeForTemplate(nodeTemplate)

  const { apply } = useDispatch()

  const handleSetValueClick = useCallback((pageY: number) => {
    apply((state) => {
      state.registry.contextMenus[`${nodeInstanceId}-${portInstanceId}-port-value`] = {
        position: {
          x: position.x + DIMENSIONS.CONTEXT_MENU_WIDTH + DIMENSIONS.CONTEXT_MENU_MARGIN,
          y: pageY - 4
        },
        context: {
          type: 'port-value',
          nodeInstanceId,
          portInstanceId,
          valueType: portTemplate.typeName,
        }
      }
    })
  }, [])

  const { enableSetValue } = getPortContextMenuButtons(context)

  return (
    <MenuBody position={position}>
      {nodeType === 'generic-parameter' ? null : <MenuHeader icon={<PortTypeIcon />} label={`${name} (${nickName})`} />}
      {enableSetValue ? (
        <SetValueButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} portTemplate={portTemplate} onClick={handleSetValueClick} />
      ) : null}
      {enableSetValue ? <MenuDivider /> : null}
      <FlattenButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} />
      <GraftButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} />
      {/* <SimplifyButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} /> */}
    </MenuBody>
  )
}

export default React.memo(PortContextMenu)
