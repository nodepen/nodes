import React, { useCallback } from 'react'
import { MenuButton } from '../../../common'
import { useDispatch, useStore } from '$'
import { COLORS, STYLES } from '@/constants'

type PinButtonProps = {
    nodeInstanceId: string
    portInstanceId: string
}

export const PinButton = ({ nodeInstanceId, portInstanceId }: PinButtonProps) => {
    const { apply } = useDispatch()

    const isPinned = useStore((state) => state.document.configuration.pinnedPorts.some((pin) => pin.nodeInstanceId === nodeInstanceId && pin.portInstanceId === portInstanceId))

    const pinIcon = <svg {...STYLES.BUTTON.SMALL}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5l-15-15m0 0v11.25m0-11.25h11.25" />
    </svg>


    const handlePin = useCallback(() => {
        apply((state) => {
            state.document.configuration.pinnedPorts.push({
                nodeInstanceId,
                portInstanceId
            })
        })
    }, [])

    const unpinIcon = <svg {...STYLES.BUTTON.SMALL}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
    </svg>


    const handleUnpin = useCallback(() => {
        apply((state) => {
            state.document.configuration.pinnedPorts = state.document.configuration.pinnedPorts.filter((pin) => {
                const sameNode = pin.nodeInstanceId === nodeInstanceId
                const samePort = pin.portInstanceId === portInstanceId

                return !sameNode && !samePort
            })
        })
    }, [])

    return isPinned
        ? <MenuButton icon={unpinIcon} label="Unpin" action={handleUnpin} />
        : <MenuButton icon={pinIcon} label="Pin" action={handlePin} />
}