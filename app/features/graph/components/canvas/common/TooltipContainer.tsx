import React from 'react'

type TooltipContainerProps = {
  children: JSX.Element
}

export const TooltipContainer = ({ children }: TooltipContainerProps): React.ReactElement => {
  return <div className="w-min p-2 flex flex-col bg-green rounded-md">{children}</div>
}
