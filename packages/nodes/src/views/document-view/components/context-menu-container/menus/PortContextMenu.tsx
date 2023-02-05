import React from 'react'

type PortContextMenu = {
    position: {
        x: number
        y: number
    }
}

export const PortContextMenu = ({ position }: PortContextMenu) => {
    const { x: left, y: top } = position

    return <div className="np-absolute np-w-16 np-h-8 np-bg-light np-rounded-md np-shadow-main np-pointer-events-auto" style={{ left, top }}></div>
}

export default PortContextMenu