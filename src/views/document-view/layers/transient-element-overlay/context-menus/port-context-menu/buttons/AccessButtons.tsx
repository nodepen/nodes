import React, { useCallback } from 'react'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'
import type { PortAccess } from '@/types'
import { useStore } from '$'

const ACCESS_OPTIONS: { access: PortAccess; label: string }[] = [
    { access: 'item', label: 'Item access' },
    { access: 'list', label: 'List access' },
    { access: 'tree', label: 'Tree access' },
]

type AccessButtonsProps = {
    nodeInstanceId: string
    portInstanceId: string
    onClick: (access: PortAccess) => void
}

export const AccessButtons = ({ nodeInstanceId, portInstanceId, onClick }: AccessButtonsProps) => {
    const currentAccess = useStore(
        (state) => state.document.nodes[nodeInstanceId]?.portConfigurations[portInstanceId]?.access ?? 'item'
    )

    const checkIcon = (
        <svg {...STYLES.BUTTON.SMALL} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    )

    return (
        <>
            {ACCESS_OPTIONS.map(({ access, label }) => (
                <AccessButton
                    key={`port-access-${access}`}
                    access={access}
                    label={label}
                    icon={currentAccess === access ? checkIcon : null}
                    onClick={onClick}
                />
            ))}
        </>
    )
}

type AccessButtonProps = {
    access: PortAccess
    label: string
    icon: React.ReactNode
    onClick: (access: PortAccess) => void
}

const AccessButton = ({ access, label, icon, onClick }: AccessButtonProps) => {
    const handleClick = useCallback(() => {
        onClick(access)
    }, [access, onClick])

    return <MenuButton icon={icon} label={label} action={handleClick} />
}
