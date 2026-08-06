import React, { useCallback } from 'react'
import { MenuButton } from '../../../common'
import { useDispatch, useStore } from '$'
import { STYLES } from '@/constants'
import { getPortDirection } from '@/utils/ports/getPortDirection'

type PinButtonProps = {
    nodeInstanceId: string
    portInstanceId: string
}

export const PinButton = ({ nodeInstanceId, portInstanceId }: PinButtonProps) => {
    const { addControl, removeControl, clearInterface } = useDispatch()

    const portDirection = getPortDirection(useStore.getState().document.nodes[nodeInstanceId], portInstanceId)

    const isPinned = useStore((state) =>
        state.document.controls[portDirection].some(
            (control) => control.ref.nodeInstanceId === nodeInstanceId && control.ref.portInstanceId === portInstanceId
        )
    )

    const pinIcon = (
        <svg {...STYLES.BUTTON.SMALL}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5l-15-15m0 0v11.25m0-11.25h11.25" />
        </svg>
    )

    const handlePin = useCallback(() => {
        addControl('input', nodeInstanceId, portInstanceId)
        clearInterface()
    }, [])

    const unpinIcon = (
        <svg {...STYLES.BUTTON.SMALL}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
        </svg>
    )

    const handleUnpin = useCallback(() => {
        removeControl('input', nodeInstanceId, portInstanceId)
        clearInterface()
    }, [])

    return isPinned ? (
        <MenuButton icon={unpinIcon} label="Remove from controls" action={handleUnpin} />
    ) : (
        <MenuButton icon={pinIcon} label={`Add to controls`} action={handlePin} />
    )
}
