import { COLORS } from '@/constants'
import React from 'react'

type RegionProps = {
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
  isFill?: boolean
  isBorder?: boolean
  isDashed?: boolean
}

export const Region = ({ from, to, isFill = false, isBorder = false, isDashed = false }: RegionProps) => {
  const { x: ax, y: ay } = from
  const { x: bx, y: by } = to

  const x = Math.min(ax, bx)
  const y = Math.min(ay, by)
  const width = Math.abs(bx - ax)
  const height = Math.abs(by - ay)

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      strokeWidth={isBorder ? 2 : 0}
      vectorEffect="non-scaling-stroke"
      stroke={COLORS.DARK}
      strokeDasharray={isDashed ? '6 6' : ''}
      rx={6}
      ry={6}
      fill={isFill ? COLORS.PALE : 'none'}
    />
  )
}
