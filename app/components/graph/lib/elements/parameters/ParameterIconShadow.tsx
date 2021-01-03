import React from 'react'

/** svg-only utility for parameter icon shadow. */
export const ParameterIconShadow = (): React.ReactElement => {
  const f = Math.sqrt(3) / 2

  const points = `1,0 0.5,-${f} -0.5,-${f} -1,0 -0.5,${f} 0.5,${f}`

  return (
    <svg width="24px" height="24px" viewBox="-1 -1 2 2">
      <defs>
        <clipPath id="annoying">
          <polygon points={points} />
        </clipPath>
      </defs>
      <polygon
        points={points}
        stroke="#333333"
        strokeWidth="6px"
        fill="#FFFFFF"
        vectorEffect="non-scaling-stroke"
        clipPath="url(#annoying)"
      />
    </svg>
  )
}