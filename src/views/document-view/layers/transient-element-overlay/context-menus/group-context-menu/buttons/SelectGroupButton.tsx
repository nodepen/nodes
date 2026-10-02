import React, { useCallback } from 'react'
import { current } from 'immer'
import { useDispatch, useStore } from '$'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'

type Props = {
    groupId: string
}

export const SelectGroupButton = ({ groupId }: Props) => {
    const { apply, clearInterface } = useDispatch()

    const handleClick = useCallback(() => {
        apply((state) => {
            const group = state.document.groups[groupId]

            if (!group) {
                console.log(`🐍 Could not find group ${groupId} to select`)
                return
            }

            // Set the group's nodes as the document selection.
            state.registry.selection.nodes = group.items.nodes.filter((id) => !!state.document.nodes[id])
            state.registry.selection.groups = []

            state.callbacks.onSelectionUpdated?.(current(state))
        })
        clearInterface()
    }, [groupId])

    const icon = (
        <svg {...STYLES.BUTTON.SMALL} strokeWidth={2}>
            <path strokeWidth={2} vectorEffect={'non-scaling-stroke'} d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )

    return <MenuButton icon={icon} label="Select group" action={handleClick} />
}
