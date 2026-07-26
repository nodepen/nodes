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
import { getValidGeometryForType } from '@/utils/geometry-types'

type PortContextMenuProps = {
    position: ContextMenu['position']
    context: PortContextMenuContext
}

const PortContextMenu = ({ position, context }: PortContextMenuProps) => {
    const { nodeInstanceId, portInstanceId, portTemplate } = context
    const { name, nickName } = portTemplate

    const nodeTemplate = useStore.getState().templates[useStore.getState().document.nodes[nodeInstanceId].templateId]
    const nodeType = getNodeTypeForTemplate(nodeTemplate)

    const { apply, toggleFlag, clearInterface } = useDispatch()

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
    const { enableSetValue, enablePickGeometry } = getPortContextMenuButtons(context)

    const handlePickGeometry = useCallback(() => {
        const validGeometryTypes = getValidGeometryForType(portTemplate.typeName)
        apply((state) => {
            state.ui.model = {
                mode: 'select',
                selection: [],
                selectionFilter: validGeometryTypes,
                source: {
                    nodeInstanceId,
                    portInstanceId
                }
            }
        })
        clearInterface()
    }, [nodeInstanceId, portInstanceId, portTemplate])

    return (
        <MenuBody position={position}>
            {nodeType === 'generic-parameter' ? null : <MenuHeader icon={<PortTypeIcon />} label={`${name} (${nickName})`} />}
            {enableSetLabel ? <SetLabelButton onClick={handleEditNameClick} /> : null}
            {enableSetValue ? (
                <SetValueButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} portTemplate={portTemplate} onClick={handleSetValueClick} />
            ) : null}
            {enablePickGeometry ? (
                <PickGeometryButton portTemplate={portTemplate} onClick={handlePickGeometry} />
            ) : null}
            {nodeType === 'generic-node' ? (
                <>
                    {enableSetLabel || enableSetValue ? <MenuDivider /> : null}
                    <FlattenButton onClick={handleToggleFlag} />
                    <GraftButton onClick={handleToggleFlag} />
                    <SimplifyButton onClick={handleToggleFlag} />
                </>
            ) : null}

        </MenuBody>
    )
}

export default React.memo(PortContextMenu)
