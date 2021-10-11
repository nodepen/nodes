import React, { useEffect, useCallback } from 'react'
import { OverlayContainer } from '../OverlayContainer'
import { OverlayPortal } from '../OverlayPortal'

type HoverTooltipProps = {
  position: [x: number, y: number]
  onClose: () => void
  children: JSX.Element
}

/**
 * A tooltip that appears with the top left corner anchored at the provided position.
 * @remarks Any keystroke or pointer event will fire the provided `onClose` callback.
 */
const HoverTooltip = ({ position, onClose, children }: HoverTooltipProps): React.ReactElement => {
  const handlePointerDown = useCallback(
    (e: PointerEvent): void => {
      if (e.pointerType !== 'mouse') {
        return
      }

      onClose()
    },
    [onClose]
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent): void => {
      if (e.pointerType !== 'mouse') {
        return
      }

      onClose()
    },
    [onClose]
  )

  const handleKeyDown = useCallback((): void => {
    onClose()
  }, [onClose])

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <OverlayPortal>
      <OverlayContainer static position={position} pointerEvents={false}>
        {children}
      </OverlayContainer>
    </OverlayPortal>
  )
}

export default React.memo(HoverTooltip)
