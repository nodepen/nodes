import React, { useCallback } from 'react'
import { useDispatch, useStore } from '$'
import { MenuButton } from '../../../common'
import { saveDocument } from '@/store/utils/saveDocument'
import { STYLES } from '@/constants'

type Props = {
    groupId: string
}

export const AddToGroupButton = ({ groupId }: Props) => {
    const { apply, clearInterface } = useDispatch()

    const handleClick = useCallback(() => {
        apply((state) => {
            const group = state.document.groups[groupId]

            if (!group) {
                console.log(`🐍 Could not find group ${groupId} to add to`)
                return
            }

            const additions = state.registry.selection.nodes.filter(
                (id) => !!state.document.nodes[id] && !group.items.nodes.includes(id)
            )

            if (additions.length === 0) {
                return
            }

            group.items.nodes = [...group.items.nodes, ...additions]

            saveDocument(state)
        })
        clearInterface()
    }, [groupId])

    const icon = (
        <svg {...STYLES.BUTTON.SMALL} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="Add to group" action={handleClick} />
}
