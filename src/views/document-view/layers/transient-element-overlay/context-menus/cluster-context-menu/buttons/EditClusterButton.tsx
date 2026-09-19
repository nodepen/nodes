import React, { useCallback } from 'react'
import { useDispatch, useStore } from '$'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'

type ButtonProps = {
    clusterInstanceId: string
}

export const EditClusterButton = ({ clusterInstanceId }: ButtonProps) => {
    const { clearInterface } = useDispatch()

    const handleClick = useCallback(() => {
        const state = useStore.getState()

        state.callbacks.onEditCluster?.(state, { clusterInstanceId })

        clearInterface()
    }, [clusterInstanceId])

    const icon = (
        <svg {...STYLES.BUTTON.SMALL} strokeWidth={2}>
            <path
                d="M16.862 4.487 18.549 2.799a1.94 1.94 0 1 1 2.744 2.745L10.94 15.987l-3.774.945a.5.5 0 0 1-.607-.606l.945-3.774 9.358-9.065ZM16.862 4.487 19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )

    return <MenuButton icon={icon} label="Edit cluster" action={handleClick} />
}
