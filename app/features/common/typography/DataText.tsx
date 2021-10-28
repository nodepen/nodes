import React from 'react'
import { getSizeClass, getColorClass } from './utils'

type DataTextProps = {
  children: string
  size: 'sm' | 'md'
  color: 'dark' | 'darkgreen'
}

export const DataText = ({ children, size, color }: DataTextProps): React.ReactElement => {
  const [divHeight, textHeight] = getSizeClass(size)
  const colorClass = getColorClass(color)

  return (
    <div className={`w-full ${divHeight} flex justify-start items-center`}>
      <pre className={`${colorClass} ${textHeight} font-panel font-semibold`}>{children}</pre>
    </div>
  )
}
