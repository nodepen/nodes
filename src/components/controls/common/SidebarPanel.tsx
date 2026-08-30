import { useDocumentRef, useImperativeEvent } from '@/hooks'
import { newGuid } from '@/utils/common'
import type React from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

type Props = React.PropsWithChildren<{
    isOpen: boolean,
    from: [px: number, py: number]
    height: number
    width?: number
    side?: 'left' | 'right'
    bottom?: number
    top?: number,
    showImmediate?: boolean
    onClose?: () => void
}>

export const SidebarPanel = ({ children, ...props }: Props) => {
    const {
        isOpen,
        from,
        side = 'left',
        showImmediate = false
    } = props

    const [totalHeight, setTotalHeight] = useState(1080)

    const [shouldTransition, setShouldTransition] = useState(!showImmediate)

    useLayoutEffect(() => {
        // Enable transitions after mount even if showImmediate is true
        if (isOpen && showImmediate) {
            setTimeout(() => {
                setShouldTransition(true)
            }, 500)
        }

        // Disable transitions before close
        if (!isOpen && showImmediate) {
            setShouldTransition(false)
        }
    }, [isOpen, showImmediate])

    useLayoutEffect(() => {
        setTotalHeight(document.documentElement.clientHeight)
    }, [])

    const [px, py] = from ?? []

    const width = isOpen ? (props.width ?? 272) : 0
    const height = isOpen ? props.height : 0

    const marginX = 36

    const left = side === 'left' ? isOpen ? marginX : px : undefined
    const right = side === 'right' ? isOpen ? marginX : marginX : undefined

    const top = isOpen ? props.top : props.top ? py : undefined
    const bottom = isOpen ? props.bottom : props.bottom ? totalHeight - py : undefined

    return <div className={`${isOpen ? 'np-shadow-main' : ''} ${shouldTransition ? 'np-transition-[width,height,left,top,bottom] np-duration-300 np-ease-out' : ''} np-absolute np-bg-light np-rounded-md np-overflow-hidden np-pointer-events-auto`} style={{ width: `${width}px`, height: `${height}px`, left: left && `${left}px`, right: right && `${right}px`, top: top ? `${top}px` : undefined, bottom: bottom ? `${bottom}px` : undefined }}>
        <div className='np-w-full np-h-full np-p-0.5'>
            <div className='np-rounded-sm np-overflow-hidden' style={{ width: `${width - 4}px`, height: `${props.height - 4}px` }}>
                {children}
            </div>
        </div>
    </div>
}