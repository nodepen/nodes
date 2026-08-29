import React, { useCallback } from 'react'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'

type EditGradientButtonProps = {
    onClick: () => void
}

export const EditGradientButton = ({ onClick }: EditGradientButtonProps) => {
    const handleClick = useCallback((_e: React.PointerEvent<HTMLButtonElement>) => {
        onClick()
    }, [onClick])

    const icon = (
        <svg {...STYLES.BUTTON.SMALL} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label="Edit gradient" action={handleClick} />
}
