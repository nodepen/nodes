import React, { useCallback } from 'react'
import { useDispatch, useStore } from '$'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'

type ButtonProps = {
    clusterId: string
}

export const ViewClusterButton = ({ clusterId }: ButtonProps) => {
    const { clearInterface } = useDispatch()

    const handleClick = useCallback(() => {
        const state = useStore.getState()

        state.callbacks.onViewCluster?.(state, { clusterId })

        clearInterface()
    }, [clusterId])

    const icon = (
        <svg {...STYLES.BUTTON.SMALL} strokeWidth={2}>
            <path
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
            <path
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )

    return <MenuButton icon={icon} label="View script" action={handleClick} />
}
