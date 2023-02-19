import React from 'react'
import type { ContextMenu, PortContextMenuContext } from '../../types'
import { MenuBody, MenuDivider, MenuHeader } from '../../common'
import { PortTypeIcon } from '@/components/icons'
import { FlattenButton, GraftButton, PinButton, SetValueButton, SimplifyButton } from './buttons'
import { getPortContextMenuButtons } from './utils'

type PortContextMenuProps = {
    position: ContextMenu['position']
    context: PortContextMenuContext
}

export const PortContextMenu = ({ position, context }: PortContextMenuProps) => {
    const { nodeInstanceId, portInstanceId, portTemplate } = context
    const { name, nickName } = portTemplate

    const { enablePin, enableSetValue } = getPortContextMenuButtons(context)

    return (
        <MenuBody position={position}>
            <MenuHeader icon={<PortTypeIcon />} label={`${name} (${nickName})`} />
            {enablePin ? <PinButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} /> : null}
            {enableSetValue ? <SetValueButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} portTemplate={portTemplate} /> : null}
            {enablePin || enableSetValue ? <MenuDivider /> : null}
            <FlattenButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} />
            <GraftButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} />
            <SimplifyButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} />
        </MenuBody>
    )
}


export default PortContextMenu