import React from 'react'

type LayerProps = {
    id: string
    z: number
    children?: React.ReactNode
}

export const Layer = ({ id, z, children }: LayerProps): React.ReactElement => {

    return (
        <div
            id={id}
            className={`np-w-full np-h-full np-pointer-events-none np-absolute np-overflow-hidden`}
            style={{ zIndex: z }}
        >
            {children}
        </div>
    )
}
