import React from 'react'
import { getSizeClass, getColorClass } from './utils'

type LabelTextProps = {
  children?: string
  size: 'sm' | 'md' | 'lg'
  color: 'dark' | 'darkgreen'
  select?: boolean
}

export const LabelText = ({ children, size, color, select = true }: LabelTextProps): React.ReactElement => {
  const [textHeight, lineHeight] = getSizeClass(size)
  const colorClass = getColorClass(color)

  return (
    <div className={`w-full flex justify-start items-center`}>
      <label
        className={`${colorClass} ${textHeight} ${lineHeight} ${select ? '' : 'select-none'} font-sans font-medium`}
      >
        {children}
      </label>
    </div>
  )
}
