import React, { useState, useCallback, useEffect } from 'react'
import { OverlayContainer } from '../OverlayContainer'
import { OverlayPortal } from '../OverlayPortal'

type MouseTooltipProps = {
  initialPosition: [sx: number, sy: number]
  content: JSX.Element
  offset: [dx: number, dy: number]
}

const MouseTooltip = ({ initialPosition, content, offset }: MouseTooltipProps): React.ReactElement => {
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
    <OverlayPortal>
      <OverlayContainer position={[sx, sy]} pointerEvents={false}>
        <div
          className="w-vw h-vh flex items-center justify-center"
          style={{ transform: `translateX(-50%) translateX(-${dx}px) translateY(-50%) translateY(-${dy}px)` }}
        >
          {content}
        </div>
      </OverlayContainer>
    </OverlayPortal>
  )
}

export default React.memo(MouseTooltip)
