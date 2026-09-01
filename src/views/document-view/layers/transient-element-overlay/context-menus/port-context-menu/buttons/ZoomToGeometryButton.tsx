import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { MenuButton } from '../../../common'
import { STYLES } from '@/constants'
import { internalCallbacksRef } from '@/store'

type ButtonProps = {
    nodeInstanceId: string
    portInstanceId: string
}

export const ZoomToGeometryButton = ({ nodeInstanceId, portInstanceId }: ButtonProps) => {
    const handleClick = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
        internalCallbacksRef.zoomToExtents?.(nodeInstanceId, portInstanceId)
    }, [nodeInstanceId, portInstanceId])

    const icon = (
        <svg {...STYLES.BUTTON.SMALL}>
            <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )

    return <MenuButton icon={icon} label={`Zoom to output`} action={handleClick} />
}
