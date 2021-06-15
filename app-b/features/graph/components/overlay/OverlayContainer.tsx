import React from 'react'

type OverlayContainerProps = {
  children: JSX.Element
  position: [left: number, top: number]
  anchor: 'left' | 'right'
}

export const OverlayContainer = ({ children, position, anchor }: OverlayContainerProps): React.ReactElement => {
  return (
    <div className="w-full h-full pointer-events-none" style={{ paddingTop: 36 + 2 + 48 }}>
      <div className="w-full h-full relative">{children}</div>
    </div>
  )
}
