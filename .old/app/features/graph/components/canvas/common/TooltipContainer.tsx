import React from 'react'

type TooltipContainerProps = {
  children: JSX.Element | JSX.Element[]
}

export const TooltipContainer = ({ children }: TooltipContainerProps): React.ReactElement => {
  return (
    <div className="w-min p-2 flex flex-col bg-green rounded-md" style={{ minWidth: 250 }}>
      {children}
    </div>
  )
}
