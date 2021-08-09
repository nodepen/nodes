import React from 'react'
import { Grasshopper } from 'glib'

type ParameterIconProps = {
  type: Grasshopper.ParameterType
  size: 'sm' | 'md'
}

export const ParameterIcon = ({ type, size }: ParameterIconProps): React.ReactElement => {
  const sizes = {
    sm: '24px',
    md: '36px',
  }

  const f = Math.sqrt(3) / 2
  const points = `1,0 0.5,-${f} -0.5,-${f} -1,0 -0.5,${f} 0.5,${f}`

  return (
    <svg width={sizes[size]} height={sizes[size]} viewBox="-1 -1 2 2">
      <defs>
        <clipPath id="annoying">
          <polygon points={points} />
        </clipPath>
      </defs>
      <polygon
        points={points}
        stroke="#333333"
        strokeWidth="4px"
        fill="#FFFFFF"
        vectorEffect="non-scaling-stroke"
        clipPath="url(#annoying)"
      />
    </svg>
  )
}
