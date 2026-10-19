import React, { useCallback } from 'react'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'

type PickFileButtonProps = {
    onClick: () => void
}

export const PickFileButton = ({ onClick }: PickFileButtonProps) => {
    const handleClick = useCallback((_e: React.PointerEvent<HTMLButtonElement>) => {
        onClick()
    }, [onClick])

    const icon = (
        <svg {...STYLES.BUTTON.SMALL}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
    )

    return <MenuButton icon={icon} label="Pick file" action={handleClick} />
}
