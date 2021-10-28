import React from 'react'
import { getSizeClass, getColorClass } from './utils'

type DataTextProps = {
  children?: string
  size: 'sm' | 'md'
  color: 'dark' | 'darkgreen'
}

export const DataText = ({ children, size, color }: DataTextProps): React.ReactElement => {
  const [textHeight, lineHeight] = getSizeClass(size)
  const colorClass = getColorClass(color)

  return (
    <div className={`w-full flex justify-start items-center overflow-hidden`}>
      <p className={`${colorClass} ${textHeight} ${lineHeight} font-panel font-semibold`}>{children}</p>
    </div>
  )
}
