import React from 'react'
import { getSizeClass, getColorClass } from './utils'

type LabelTextProps = {
  children?: string
  size: 'sm' | 'md'
  color: 'dark' | 'darkgreen'
}

export const LabelText = ({ children, size, color }: LabelTextProps): React.ReactElement => {
  const [textHeight, lineHeight] = getSizeClass(size)
  const colorClass = getColorClass(color)

  return (
    <div className={`w-full flex justify-start items-center`}>
      <label className={`${colorClass} ${textHeight} ${lineHeight} font-sans font-medium`}>{children}</label>
    </div>
  )
}
