import React, { useCallback } from 'react'
import type { ContextMenu, PortContextMenuContext } from '../../types'
import { MenuBody, MenuDivider, MenuHeader } from '../../common'
import { PortTypeIcon } from '@/components/icons'
import { AccessButtons, FlattenButton, GraftButton, PinButton, ReparameterizeButton, SetLabelButton, SetValueButton, SimplifyButton } from './buttons'
import { getPortContextMenuButtons } from './utils'
import { useDispatch, useStore } from '$'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { tryGetTemplate } from '@/utils/templates/tryGetTemplate'
import { DIMENSIONS } from '@/constants'
import { clearMenus } from '@/store/utils/clearMenus'
import { getPortContextMenuKey } from '@/utils/keys/getPortContextMenuKey'
import { usePickFile } from '@/hooks'
import type { PortAccess, PortFlag } from '@/types'
import { expireSolution } from '@/store/utils'
import { PickGeometryButton } from './buttons/PickGeometryButton'
import { PickFileButton } from './buttons/PickFileButton'
import { ZoomToGeometryButton } from './buttons/ZoomToGeometryButton'

type PortContextMenuProps = {
    position: ContextMenu['position']
    context: PortContextMenuContext
}

const PortContextMenu = ({ position, context }: PortContextMenuProps) => {
    const { nodeInstanceId, portInstanceId, portTemplate } = context
    const { name, nickName, typeName } = portTemplate

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

    const handleSetAccess = useCallback((access: PortAccess) => {
        apply((state) => {
            const configuration = state.document.nodes[nodeInstanceId]?.portConfigurations[portInstanceId]

            if (!configuration) {
                return
            }

            configuration.access = access

            expireSolution(state)
        })
        clearInterface()
    }, [nodeInstanceId, portInstanceId])

    const handlePickGeometry = useCallback(() => {
        startModelSelection(nodeInstanceId, portInstanceId, portTemplate.typeName)
    }, [nodeInstanceId, portInstanceId, portTemplate, startModelSelection])

    const pickFile = usePickFile(nodeInstanceId, portInstanceId)

    const handlePickFile = useCallback(() => {
        clearInterface()
        pickFile?.()
    }, [clearInterface, pickFile])

    const node = useStore.getState().document.nodes[nodeInstanceId]

    if (!node) {
        return null
    }

    const nodeTemplate = tryGetTemplate(node.templateId)
    const nodeType = getNodeTypeForTemplate(nodeTemplate)

    const enableSetAccess = nodeType === 'script' && portTemplate.__direction === 'input'

    const { enableSetLabel, enablePinInput, enablePinOutput, enableSetValue, enablePickGeometry, enablePickFile, enableZoomToGeometry, enableReparameterize } = getPortContextMenuButtons(context)

    return (
        <MenuBody position={position}>
            {nodeType === 'generic-node' || nodeType === 'expression' || nodeType === 'script' ? <MenuHeader icon={<PortTypeIcon typeName={typeName as any} />} label={`${name} (${nickName})`} /> : null}
            {enableSetLabel ? <SetLabelButton onClick={handleEditNameClick} /> : null}
            {enableSetValue ? (
                <SetValueButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} portTemplate={portTemplate} onClick={handleSetValueClick} />
            ) : null}
            {enablePickGeometry ? <PickGeometryButton portTemplate={portTemplate} onClick={handlePickGeometry} /> : null}
            {enablePickFile ? <PickFileButton onClick={handlePickFile} /> : null}
            {enableSetLabel || enableSetValue || enablePickGeometry || enablePickFile ? <MenuDivider /> : null}
            {enablePinInput ? <PinButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} controlType="input" /> : null}
            {enablePinOutput ? <PinButton nodeInstanceId={nodeInstanceId} portInstanceId="output" controlType="output" /> : null}
            {enableZoomToGeometry ? (<>
                <ZoomToGeometryButton nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} />
                <MenuDivider />
            </>) : null}
            {nodeType === 'generic-node' || nodeType === 'expression' || nodeType === 'script' || nodeType === 'cluster' ? (
                <>
                    <FlattenButton onClick={handleToggleFlag} />
                    <GraftButton onClick={handleToggleFlag} />
                    <SimplifyButton onClick={handleToggleFlag} />
                    {enableReparameterize ? (
                        <>
                            <MenuDivider />
                            <ReparameterizeButton onClick={handleToggleFlag} />
                        </>
                    ) : null}
                </>
            ) : null}
            {enableSetAccess ? (
                <>
                    <MenuDivider />
                    <AccessButtons nodeInstanceId={nodeInstanceId} portInstanceId={portInstanceId} onClick={handleSetAccess} />
                </>
            ) : null}
        </MenuBody>
    )
}

export default React.memo(PortContextMenu)
