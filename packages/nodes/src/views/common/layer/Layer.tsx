import React from 'react'

type LayerProps = {
  id: string
  position?: number
  /** If `true`, layer is always rendered in the same position. */
  fixed?: boolean
  z: number
  children?: React.ReactNode
}

export const Layer = ({ id, position = 0, z, fixed = false, children }: LayerProps): React.ReactElement => {
  const transform = fixed ? 0 : position * 100

  return (
    <div
      id={id}
      className="np-w-full np-h-full np-absolute np-pointer-events-none np-overflow-hidden"
      style={{
        zIndex: z,
        transition: 'transform',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        transform: `translateX(${transform}%)`,
      }}
    >
      {children}
    </div>
  )
}
