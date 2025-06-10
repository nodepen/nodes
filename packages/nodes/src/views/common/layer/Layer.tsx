import React from 'react'

type LayerProps = {
  id: string
  position?: number
  /** Percentage of window size width to fill */
  width?: number
  /** If `true`, layer is always rendered in the same position. */
  fixed?: boolean
  /** If `true`, layer will crop content to width instead of resizing. */
  crop?: boolean
  z: number
  children?: React.ReactNode
}

export const Layer = ({ id, position = 0, width = 1, z, crop = false, fixed = false, children }: LayerProps): React.ReactElement => {
  const transform = fixed ? 0 : position * 100
  const vw = width * 100

  return (
    <div
      id={id}
      className={`${crop ? 'np-w-full' : ''} np-h-full np-absolute np-pointer-events-none np-overflow-hidden`}
      style={{
        zIndex: z,
        transform: `translateX(${transform}%)`,
        width: crop ? undefined : `${vw}%`
      }}
    >
      {crop
        ? <>
          <div className='np-h-full np-overflow-hidden' style={{ width: `${vw}%` }}>
            <div className='np-w-vw np-h-full'>
              {children}
            </div>
          </div>
        </>
        : <>{children}</>
      }
    </div>
  )
}
