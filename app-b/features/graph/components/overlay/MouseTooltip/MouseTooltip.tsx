import React, { useState, useCallback, useEffect } from 'react'
import { OverlayContainer } from '../OverlayContainer'
import { OverlayPortal } from '../OverlayPortal'

type MouseTooltipProps = {
  initialPosition: [sx: number, sy: number]
  offset: [dx: number, dy: number]
  children?: JSX.Element
}

const MouseTooltip = ({ initialPosition, offset, children }: MouseTooltipProps): React.ReactElement => {
  const [[sx, sy], setPosition] = useState(initialPosition)

  const handleMouseMove = useCallback((e: MouseEvent): void => {
    const { pageX, pageY } = e
    setPosition([pageX, pageY])
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  })

  const [dx, dy] = offset

  return (
    <OverlayPortal z={200}>
      <OverlayContainer static position={[0, 0]} pointerEvents={false}>
        <div
          className="w-vw h-vh flex items-center justify-center"
          style={{
            transform: `translateX(-50%) translateX(${sx}px) translateX(${dx}px) translateY(-50%) translateY(${sy}px) translateY(${dy}px) translateY(-40px) `,
          }}
        >
          {children}
        </div>
      </OverlayContainer>
    </OverlayPortal>
  )
}

export default React.memo(MouseTooltip)
