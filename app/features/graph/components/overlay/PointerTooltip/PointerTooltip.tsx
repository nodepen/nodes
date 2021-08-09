import React, { useState, useCallback, useEffect } from 'react'
import { OverlayContainer } from '../OverlayContainer'
import { OverlayPortal } from '../OverlayPortal'

type PointerTooltipProps = {
  initialPosition: [sx: number, sy: number]
  offset: [dx: number, dy: number]
  pointerFilter: number[]
  pointerTypeFilter: React.PointerEvent['pointerType'][]
  children?: JSX.Element
}

const PointerTooltip = ({
  initialPosition,
  offset,
  pointerFilter,
  pointerTypeFilter,
  children,
}: PointerTooltipProps): React.ReactElement => {
  const [[sx, sy], setPosition] = useState(initialPosition)

  const handlePointerMove = useCallback(
    (e: PointerEvent): void => {
      if (pointerFilter.length > 0 && !pointerFilter.includes(e.pointerId)) {
        return
      }

      if (pointerTypeFilter.length > 0 && !pointerTypeFilter.includes(e.pointerType as any)) {
        return
      }

      const { pageX, pageY } = e
      setPosition([pageX, pageY])
    },
    [pointerFilter, pointerTypeFilter]
  )

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
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

export default React.memo(PointerTooltip)
