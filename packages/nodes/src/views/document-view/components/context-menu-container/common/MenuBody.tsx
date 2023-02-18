import React from 'react'
import { usePseudoShadow } from '@/views/common/pseudo-shadow'

type MenuBodyProps = {
    children: React.ReactNode
    position: {
        x: number
        y: number
    }
}

export const MenuBody = ({ children, position }: MenuBodyProps) => {
    const shadowTarget = usePseudoShadow()

    const { x: left, y: top } = position

    return (
        <div ref={shadowTarget} className="np-absolute np-w-48 np-p-1 np-rounded-md np-bg-light np-shadow-main np-pointer-events-auto np-select-none" style={{ left, top }}>
            <div className='np-overflow-hidden np-animate-menu-appear'>
                {children}
            </div>
        </div>
    )
}