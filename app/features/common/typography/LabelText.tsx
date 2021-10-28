import React from 'react'
import { getSizeClass, getColorClass } from './utils'

type LabelTextProps = {
  children: string
  size: 'sm' | 'md' | 'lg'
  color: 'dark' | 'darkgreen'
}

export const LabelText = ({ children, size, color }: LabelTextProps): React.ReactElement => {
  const [divHeight, textHeight] = getSizeClass(size)
  const colorClass = getColorClass(color)

  return (
    <div className={`w-full ${divHeight} flex justify-start items-center`}>
      <label className={`${colorClass} ${textHeight} font-sans`}>{children}</label>
    </div>
  )
}
