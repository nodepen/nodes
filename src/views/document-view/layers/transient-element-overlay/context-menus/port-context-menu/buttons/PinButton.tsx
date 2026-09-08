import React, { useCallback } from 'react'
import { MenuButton } from '../../../common'
import { useDispatch, useStore } from '$'
import { STYLES } from '@/constants'

type PinButtonProps = {
    nodeInstanceId: string
    portInstanceId: string
    controlType: 'input' | 'output'
}

export const PinButton = ({ nodeInstanceId, portInstanceId, controlType }: PinButtonProps) => {
    const { addControl, removeControl, clearInterface } = useDispatch()

    const isPinned = useStore((state) =>
        Object.values(state.document.controls[controlType]).some(
            (control) => control.ref.nodeInstanceId === nodeInstanceId && control.ref.portInstanceId === portInstanceId
        )
    )

    const label = controlType === 'output' ? 'outputs' : 'controls'

    const pinIcon = (
        <svg {...STYLES.BUTTON.SMALL}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5l-15-15m0 0v11.25m0-11.25h11.25" />
        </svg>
    )

    const handlePin = useCallback(() => {
        addControl(controlType, nodeInstanceId, portInstanceId)
        clearInterface()
    }, [addControl, clearInterface, controlType, nodeInstanceId, portInstanceId])

    const unpinIcon = (
        <svg {...STYLES.BUTTON.SMALL}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
        </svg>
    )

    const handleUnpin = useCallback(() => {
        removeControl(controlType, nodeInstanceId, portInstanceId)
        clearInterface()
    }, [removeControl, clearInterface, controlType, nodeInstanceId, portInstanceId])

    return isPinned ? (
        <MenuButton icon={unpinIcon} label={`Remove from ${label}`} action={handleUnpin} />
    ) : (
        <MenuButton icon={pinIcon} label={`Add to ${label}`} action={handlePin} />
    )
}
