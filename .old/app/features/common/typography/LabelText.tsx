import React from 'react'
import { getSizeClass, getColorClass } from './utils'

type LabelTextProps = {
  children?: string
  size: 'xs' | 'sm' | 'md' | 'lg'
  color: 'dark' | 'darkgreen'
  justify?: 'start' | 'end'
  select?: boolean
}

export const LabelText = ({
  children,
  size,
  color,
  justify = 'start',
  select = true,
}: LabelTextProps): React.ReactElement => {
  const [textHeight, lineHeight] = getSizeClass(size)
  const colorClass = getColorClass(color)

  return (
    <div className={`${justify === 'start' ? 'justify-start' : 'justify-end'} w-full flex items-center`}>
      <label
        className={`${colorClass} ${textHeight} ${lineHeight} ${
          select ? '' : 'select-none pointer-events-none'
        } font-sans font-medium`}
      >
        {children}
      </label>
    </div>
  )
}
