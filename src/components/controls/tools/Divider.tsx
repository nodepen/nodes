import { COLORS } from '@/constants'
import React from 'react'

export const Divider = () => {
  return (
    <div className="np-w-6 np-h-full np-flex np-flex-col np-items-center np-justify-center">
      <svg width="20" height="60" viewBox='0 0 20 60'>
        <Cross at={[10, 13]} size={3} />
        <Cross at={[10, 30]} size={3} />
        <Cross at={[10, 47]} size={3} />
      </svg>
    </div>
  )
}

type CrossProps = {
  at: [x: number, y: number]
  size: number
}

const Cross = ({ at, size }: CrossProps) => {
  const [x, y] = at
  return (
    <>
      <line x1={x - size} y1={y - size} x2={x + size} y2={y + size} stroke={COLORS.DARK} strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <line x1={x - size} y1={y + size} x2={x + size} y2={y - size} stroke={COLORS.DARK} strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </>
  )
}