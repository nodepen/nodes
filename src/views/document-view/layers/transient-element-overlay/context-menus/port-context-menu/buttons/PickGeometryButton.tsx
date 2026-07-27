import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'

type PickGeometryButtonProps = {
    portTemplate: NodePen.PortTemplate
    onClick: () => void
}

export const PickGeometryButton = ({ portTemplate, onClick }: PickGeometryButtonProps) => {
    const { typeName } = portTemplate

    const handleClick = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
        onClick()
    }, [])

    const icon = (
        <svg {...STYLES.BUTTON.SMALL}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
    )

    return <MenuButton icon={icon} label={`Pick ${typeName} geometry`} action={handleClick} />
}
