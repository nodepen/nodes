import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import type { ContextMenu } from '../../types'
import type { ValueListOptionsContextMenuContext } from '../../types/ContextMenuContext'
import { MenuBody, MenuButton } from '../../common'
import { useDispatch, useStore } from '$'
import { STYLES } from '@/constants'
import { expireSolution } from '@/store/utils'

type ValueListOptionsContextMenuProps = {
    position: ContextMenu['position']
    context: ValueListOptionsContextMenuContext
}

const ValueListOptionsContextMenu = ({ position, context }: ValueListOptionsContextMenuProps) => {
    const { nodeInstanceId } = context

    const { apply, clearInterface } = useDispatch()

    const node = useStore((state) => state.document.nodes[nodeInstanceId])

    const handleSelect = useCallback((index: number) => {
        apply((state) => {
            const node = state.document.nodes[nodeInstanceId]

            if (!node) {
                return
            }

            const config = node.nodeConfiguration as NodePen.ValueListConfig

            config.items.forEach((item, i) => {
                item.isSelected = i === index
            })

            expireSolution(state)
        })
        clearInterface()
    }, [nodeInstanceId])

    const checkIcon = (
        <svg {...STYLES.BUTTON.SMALL} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    )

    if (!node) {
        return null
    }

    const { items } = node.nodeConfiguration as NodePen.ValueListConfig

    return (
        <MenuBody position={position}>
            {items.map((item, index) => (
                <MenuButton
                    key={`value-list-option-${index}`}
                    icon={item.isSelected ? checkIcon : null}
                    label={item.name}
                    isSelected={item.isSelected}
                    action={() => handleSelect(index)}
                />
            ))}
        </MenuBody>
    )
}

export default React.memo(ValueListOptionsContextMenu)
