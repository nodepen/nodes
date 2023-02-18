import React, { useCallback } from 'react'
import type * as NodePen from '@nodepen/core'
import { MenuButton } from '../../../common'
import { useDispatch, useStore } from '$'
import { COLORS, STYLES } from '@/constants'

type FlattenButtonProps = {
    nodeInstanceId: string
    portInstanceId: string
}

export const FlattenButton = ({ nodeInstanceId, portInstanceId }: FlattenButtonProps) => {

    const handleFlatten = useCallback(() => {
        console.log('🐍 Not yet implemented!')
    }, [])

    const icon = (
        <div className='np-w-[18px] np-h-[18px] np-rounded-sm np-bg-light np-border-2 np-border-dark np-flex np-justify-center np-items-center'>
            <svg {...STYLES.BUTTON.SMALL} width={14} height={14}>
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
            </svg>
        </div>
    )

    return <MenuButton icon={icon} label="Flatten" action={handleFlatten} />
}