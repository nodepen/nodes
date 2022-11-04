import React from 'react'
import { COLORS } from '@/constants'

type NavigationIconProps = {
  d: string
}

export const NavigationIcon = ({ d }: NavigationIconProps): React.ReactElement => {
  return (
    <svg
      style={{ width: 20, height: 20 }}
      fill="none"
      stroke={COLORS.DARK}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} vectorEffect="non-scaling-stroke" d={d} />
    </svg>
  )
}
