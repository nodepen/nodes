import React from 'react'
import type { ContextMenu, PortContextMenuContext } from '../../types'
import { MenuBody, MenuDivider } from '../../common'
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
            <div className='np-w-full np-flex np-flex-col np-justify-start'>
                <div className='np-w-full np-flex np-items-center np-pl-1 np-h-8 np-mb-1 last:np-mb-0 np-border-2 np-border-dark np-rounded-sm'>
                    <PortTypeIcon />
                    <p className='np-pl-2 np-font-sans np-font-medium np-text-dark np-text-sm -np-translate-y-px'>
                        {`${name} (${nickName})`}
                    </p>
                </div>
                {enablePin ? <PinButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} /> : null}
                {enableSetValue ? <SetValueButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} portTemplate={portTemplate} /> : null}
                {enablePin || enableSetValue ? <MenuDivider /> : null}
                <FlattenButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} />
                <GraftButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} />
                <SimplifyButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} />
            </div>
        </MenuBody>
    )
}


export default PortContextMenu