import React, { useCallback } from 'react'
import type { ContextMenu, PortContextMenuContext } from '../../types'
import { MenuBody, MenuDivider, MenuHeader } from '../../common'
import { PortTypeIcon } from '@/components/icons'
import { FlattenButton, GraftButton, PinButton, SetLabelButton, SetValueButton, SimplifyButton } from './buttons'
import { getPortContextMenuButtons } from './utils'
import { useDispatch, useStore } from '$'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { DIMENSIONS } from '@/constants'
import { clearMenus } from '@/store/utils/clearMenus'
import { getPortContextMenuKey } from '@/utils/keys/getPortContextMenuKey'
import type { PortFlag } from '@/types'
import { PickGeometryButton } from './buttons/PickGeometryButton'
import { ZoomToGeometryButton } from './buttons/ZoomToGeometryButton'

type PortContextMenuProps = {
    position: ContextMenu['position']
    context: PortContextMenuContext
}

const PortContextMenu = ({ position, context }: PortContextMenuProps) => {
    const { nodeInstanceId, portInstanceId, portTemplate } = context
    const { name, nickName, typeName } = portTemplate

    const nodeTemplate = useStore.getState().templates[useStore.getState().document.nodes[nodeInstanceId].templateId]
    const nodeType = getNodeTypeForTemplate(nodeTemplate)

    const { apply, toggleFlag, clearInterface, startModelSelection } = useDispatch()

    const handleSetValueClick = useCallback((pageY: number) => {
        apply((state) => {
            clearMenus(state, [getPortContextMenuKey(nodeInstanceId, portInstanceId)])
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

    const handleEditNameClick = useCallback((pageY: number) => {
        apply((state) => {
            clearMenus(state, [getPortContextMenuKey(nodeInstanceId, portInstanceId)])
            state.registry.contextMenus[`${nodeInstanceId}-${portInstanceId}-port-label`] = {
                position: {
                    x: position.x + DIMENSIONS.CONTEXT_MENU_WIDTH + DIMENSIONS.CONTEXT_MENU_MARGIN,
                    y: pageY - 4
                },
                context: {
                    type: 'port-label',
                    nodeInstanceId,
                    portInstanceId
                }
            }
        })
    }, [])

    const handleToggleFlag = useCallback((flag: PortFlag) => {
        clearInterface()
        toggleFlag(nodeInstanceId, portInstanceId, flag)
    }, [])

    const enableSetLabel = nodeType === 'generic-parameter'
    const { enablePin, enableSetValue, enablePickGeometry, enableZoomToGeometry } = getPortContextMenuButtons(context)

    const handlePickGeometry = useCallback(() => {
        startModelSelection(nodeInstanceId, portInstanceId, portTemplate.typeName)
    }, [nodeInstanceId, portInstanceId, portTemplate, startModelSelection])

    return (
        <MenuBody position={position}>
            {nodeType === 'generic-node' ? <MenuHeader icon={<PortTypeIcon typeName={typeName as any} />} label={`${name} (${nickName})`} /> : null}
            {enableSetLabel ? <SetLabelButton onClick={handleEditNameClick} /> : null}
            {enableSetValue ? (
                <SetValueButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} portTemplate={portTemplate} onClick={handleSetValueClick} />
            ) : null}
            {enablePickGeometry ? <PickGeometryButton portTemplate={portTemplate} onClick={handlePickGeometry} /> : null}
            {enableSetLabel || enableSetValue || enableSetValue ? <MenuDivider /> : null}
            {enablePin ? <PinButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} /> : null}
            {enableZoomToGeometry ? (<>
                <ZoomToGeometryButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} />
                <MenuDivider />
            </>) : null}
            {nodeType === 'generic-node' ? (
                <>
                    <FlattenButton onClick={handleToggleFlag} />
                    <GraftButton onClick={handleToggleFlag} />
                    <SimplifyButton onClick={handleToggleFlag} />
                </>
            ) : null}
        </MenuBody>
    )
}

export default React.memo(PortContextMenu)
