import React from 'react'
import { COLORS } from '@/constants'

type PortTypeIconProps = {
  position?: { x: number, y: number }
}

export const PortTypeIcon = ({ position }: PortTypeIconProps): React.ReactElement => {
  const { x, y } = position ?? {}

  const r = 20

  const px = `${r}px`
  const s = r / 2

  const a = s
  const b = s / 2
  const f = (Math.sqrt(3) / 2) * s
  const points = `${a},0 ${b},-${f} -${b},-${f} -${a},0 -${b},${f} ${b},${f}`

  return (
    <svg x={x} y={y} width={px} height={px} viewBox={`0 0 ${s * 2} ${s * 2}`}>
      <defs>
        <clipPath id="annoying">
          <polygon points={points} />
        </clipPath>
      </defs>
      <polygon
        points={points}
        stroke={COLORS.DARK}
        strokeWidth="4px"
        fill={COLORS.DARK}
        vectorEffect="non-scaling-stroke"
        clipPath="url(#annoying)"
        style={{ transform: `translate(${s}px, ${s}px)` }}
      />
    </svg>
  )
}
