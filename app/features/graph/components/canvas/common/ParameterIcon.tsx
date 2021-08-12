import React from 'react'
import { Grasshopper } from 'glib'

type ParameterIconProps = {
  type: Grasshopper.ParameterType
  size: 'sm' | 'md'
}

export const ParameterIcon = ({ type, size }: ParameterIconProps): React.ReactElement => {
  const sizes = {
    sm: 24,
    md: 36,
  }

  const px = `${sizes[size]}px`
  const s = sizes[size] / 2

  const a = s
  const b = s / 2
  const f = (Math.sqrt(3) / 2) * s
  const points = `${a},0 ${b},-${f} -${b},-${f} -${a},0 -${b},${f} ${b},${f}`

  const getIcon = (type: Grasshopper.ParameterType): JSX.Element | null => {
    switch (type) {
      case 'number':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            stroke="#FFF"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
            style={{ transformOrigin: '50% 50%', transform: 'scale(0.6)' }}
          />
        )
      default:
        return null
    }
  }

  const icon = getIcon(type)

  return (
    <div title={`${type} parameter`}>
      <svg width={px} height={px} viewBox={`0 0 ${s * 2} ${s * 2}`}>
        <defs>
          <clipPath id="annoying">
            <polygon points={points} />
          </clipPath>
        </defs>
        <polygon
          points={points}
          stroke="#333333"
          strokeWidth="4px"
          fill="#333"
          vectorEffect="non-scaling-stroke"
          clipPath="url(#annoying)"
          style={{ transform: `translate(${s}px, ${s}px)` }}
        />
        {icon}
      </svg>
    </div>
  )
}
