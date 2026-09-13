import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import type { ContextMenu } from '../../types'
import type { NodeContextMenuContext } from '../../types/ContextMenuContext'
import { MenuBody, MenuButton, MenuDivider, MenuHeader } from '../../common'
import { getIconAsImage } from '@/utils/templates'
import { DisableButton, VisibilityButton } from './buttons'
import { useDispatch, useStore } from '$'
import { STYLES, SUPPORTED_TOGGLE_TEMPLATES } from '@/constants'
import { expireSolution } from '@/store/utils'

type NodeContextMenuProps = {
    position: ContextMenu['position']
    context: NodeContextMenuContext
}

export const NodeContextMenu = ({ position, context }: NodeContextMenuProps) => {
    const { nodeInstanceId, nodeTemplate } = context
    const { guid, name, toggles } = nodeTemplate

    const { apply, clearInterface } = useDispatch()

    const nodeConfiguration = useStore(
        (state) => state.document.nodes[nodeInstanceId]?.nodeConfiguration
    ) as NodePen.GenericConfiguration | undefined

    // TODO: Support them all in solver
    const showToggles = SUPPORTED_TOGGLE_TEMPLATES.includes(guid) && toggles.length > 0

    const handleSelectToggle = useCallback((group: NodePen.NodeToggle, value: string) => {
        apply((state) => {
            const node = state.document.nodes[nodeInstanceId]

            if (!node) {
                return
            }

            const config = (node.nodeConfiguration ?? { toggles: {} }) as NodePen.GenericConfiguration
            node.nodeConfiguration = config

            if (group.mode === 'radio') {
                group.items.forEach((item) => {
                    config.toggles[item.value] = item.value === value
                })
            } else {
                config.toggles[value] = !config.toggles[value]
            }

            expireSolution(state)
        })
        clearInterface()
    }, [nodeInstanceId])

    const menuIcon = (
        <img
            width={20}
            height={20}
            src={getIconAsImage(nodeTemplate)}
            alt={`${nodeTemplate.name} (${nodeTemplate.nickName}): ${nodeTemplate.description}`}
        />
    )

    const checkIcon = (
        <svg {...STYLES.BUTTON.SMALL} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    )

    return (
        <MenuBody position={position}>
            <MenuHeader icon={menuIcon} label={name} />
            <VisibilityButton nodeInstanceId={nodeInstanceId} />
            {showToggles ? (
                <>
                    <MenuDivider />
                    {toggles.map((group, groupIndex) =>
                        group.items.map((item) => {
                            const isSelected = nodeConfiguration?.toggles?.[item.value] === true

                            return (
                                <MenuButton
                                    key={`toggle-${groupIndex}-${item.value}`}
                                    icon={isSelected ? checkIcon : null}
                                    label={item.label}
                                    isSelected={isSelected}
                                    action={() => handleSelectToggle(group, item.value)}
                                />
                            )
                        })
                    )}
                </>
            ) : null}
        </MenuBody>
    )
}
