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
}

export const Region = ({ from, to }: RegionProps) => {
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
      strokeWidth={2}
      vectorEffect="non-scaling-stroke"
      stroke={COLORS.DARK}
      fill="none"
    />
  )
}
