import { useDocumentRef, useImperativeEvent } from '@/hooks'
import { newGuid } from '@/utils/common'
import type React from 'react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

type Props = React.PropsWithChildren<{
    isOpen: boolean,
    from: [px: number, py: number]
    height: number
    bottom?: number
    top?: number,
    onClose?: () => void
}>

export const SidebarPanel = ({ children, ...props }: Props) => {
    const {
        isOpen,
        from,
    } = props

    const [totalHeight, setTotalHeight] = useState(1080)

    useLayoutEffect(() => {
        setTotalHeight(document.documentElement.clientHeight)
    }, [])

    const [px, py] = from ?? []

    const width = isOpen ? 276 : 0
    const height = isOpen ? props.height : 0

    const left = isOpen ? 36 : px
    const top = isOpen ? props.top : props.top ? py : undefined
    const bottom = isOpen ? props.bottom : props.bottom ? totalHeight - py : undefined

    return <div className={`${isOpen ? 'np-shadow-main' : ''} np-absolute np-transition-[width,height,left,top,bottom] np-bg-light np-rounded-md np-overflow-hidden np-pointer-events-auto np-duration-300 np-ease-out`} style={{ width: `${width}px`, height: `${height}px`, left: `${left}px`, top: top ? `${top}px` : undefined, bottom: bottom ? `${bottom}px` : undefined }}>
        <div className='np-w-full np-h-full np-p-0.5'>
            <div className='np-rounded-md np-overflow-hidden' style={{ width: `${width - 4}px`, height: `${props.height - 4}px` }}>
                {children}
            </div>
        </div>
    </div>
}