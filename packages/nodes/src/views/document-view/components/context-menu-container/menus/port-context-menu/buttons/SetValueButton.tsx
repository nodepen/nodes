import React, { useCallback } from 'react'
import type * as NodePen from '@nodepen/core'
import { MenuButton } from '../../../common'
import { useDispatch, useStore } from '$'
import { COLORS, STYLES } from '@/constants'

type SetValueButtonProps = {
    nodeInstanceId: string
    portInstanceId: string
    portTemplate: NodePen.PortTemplate
}

export const SetValueButton = ({ nodeInstanceId, portInstanceId, portTemplate }: SetValueButtonProps) => {
    const { typeName } = portTemplate

    const handleSetValue = useCallback(() => {
        console.log('🐍 Not yet implemented!')
    }, [])

    const icon = <svg {...STYLES.BUTTON.SMALL}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>


    return <MenuButton icon={icon} label={`Set ${typeName} value`} action={handleSetValue} />
}