import React, { useCallback } from 'react'
import { useDispatch, useStore } from '$'
import { MenuButton } from '../../../common'
import { saveDocument } from '@/store/utils/saveDocument'
import { STYLES } from '@/constants'

type Props = {
    groupId: string
}

export const RemoveFromGroupButton = ({ groupId }: Props) => {
    const { apply, clearInterface } = useDispatch()

    const handleClick = useCallback(() => {
        apply((state) => {
            const group = state.document.groups[groupId]

            if (!group) {
                console.log(`🐍 Could not find group ${groupId} to remove from`)
                return
            }

            const selected = new Set(state.registry.selection.nodes)
            const nextNodes = group.items.nodes.filter((id) => !selected.has(id))

            if (nextNodes.length === group.items.nodes.length) {
                return
            }

            if (nextNodes.length === 0) {
                delete state.document.groups[groupId]
                state.registry.selection.groups = state.registry.selection.groups.filter((id) => id !== groupId)
            } else {
                group.items.nodes = nextNodes
            }

            saveDocument(state)
        })
        clearInterface()
    }, [groupId])

    const icon = (
        <svg {...STYLES.BUTTON.SMALL} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="Remove from group" action={handleClick} />
}
