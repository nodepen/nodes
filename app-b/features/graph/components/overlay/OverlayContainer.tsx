import React from 'react'

type OverlayContainerProps = {
  children: JSX.Element
  position: [left: number, top: number]
}

export const OverlayContainer = ({ children, position }: OverlayContainerProps): React.ReactElement => {
  const [left, top] = position

  return (
    <div className="w-full h-full pointer-events-none relative">
      <div className="w-full h-full absolute" style={{ left, top }}>
        <div className="w-full h-full relative">{children}</div>
      </div>
    </div>
  )
}
