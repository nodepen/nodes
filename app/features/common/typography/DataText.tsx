import React from 'react'
import { getSizeClass, getColorClass } from './utils'

type DataTextProps = {
  children?: string
  size: 'sm' | 'md'
  color: 'dark' | 'darkgreen'
  align?: 'left' | 'right'
}

export const DataText = ({ children, size, color, align = 'left' }: DataTextProps): React.ReactElement => {
  const [textHeight, lineHeight] = getSizeClass(size)
  const colorClass = getColorClass(color)

  const alignClass = align === 'left' ? '' : 'text-right'

  return (
    <div className={`w-full flex justify-start items-center overflow-hidden`}>
      <p className={`${colorClass} ${textHeight} ${lineHeight} ${alignClass} w-full font-panel font-semibold`}>
        {children}
      </p>
    </div>
  )
}
