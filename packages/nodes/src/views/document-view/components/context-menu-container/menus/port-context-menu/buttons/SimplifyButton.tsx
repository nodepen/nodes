import React, { useCallback } from 'react'
import type * as NodePen from '@nodepen/core'
import { MenuButton } from '../../../common'
import { useDispatch, useStore } from '$'
import { COLORS, STYLES } from '@/constants'

type SimplifyButtonProps = {
    nodeInstanceId: string
    portInstanceId: string
}

export const SimplifyButton = ({ nodeInstanceId, portInstanceId }: SimplifyButtonProps) => {

    const handleSimplify = useCallback(() => {
        console.log('🐍 Not yet implemented!')
    }, [])

    const icon = (
        <div className='np-w-[18px] np-h-[18px] np-rounded-sm np-bg-light np-border-2 np-border-dark np-flex np-justify-center np-items-center'>
            <svg {...STYLES.BUTTON.SMALL} width={14} height={14}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
            </svg>
        </div>
    )

    return <MenuButton icon={icon} label="Simplify" action={handleSimplify} />
}