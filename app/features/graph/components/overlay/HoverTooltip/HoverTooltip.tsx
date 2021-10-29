import React, { useEffect, useCallback } from 'react'
import { useOverlayOffset } from '../hooks'
import { OverlayContainer } from '../OverlayContainer'
import { OverlayPortal } from '../OverlayPortal'

type HoverTooltipProps = {
  position: [x: number, y: number]
  offset?: [dx: number, dy: number]
  onClose: () => void
  children: JSX.Element
}

/**
 * A tooltip that appears anchored to the provided position. Will select best corner based on screen space.
 * @remarks Any keystroke or pointer event will fire the provided `onClose` callback.
 */
const HoverTooltip = ({
  position,
  offset = [32, 32],
  onClose,
  children,
}: HoverTooltipProps): React.ReactElement | null => {
  const offsetPosition = useOverlayOffset(position)

  const handleClick = useCallback((): void => {
    onClose()
  }, [onClose])

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
    window.addEventListener('click', handleClick)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  const [x, y] = position
  const [dx, dy] = offset

  const vertical = y > window.innerHeight * 0.55 ? 'B' : 'T'
  const horizontal = x > window.innerWidth * 0.55 ? 'R' : 'L'

  const anchor: 'TL' | 'TR' | 'BL' | 'BR' = `${vertical}${horizontal}`

  const transform = ((): string => {
    switch (anchor) {
      case 'TL': {
        return `translateX(${dx}px) translateY(${dy}px)`
      }
      case 'TR': {
        return `translateX(calc(-100% - ${dx / 2}px)) translateY(${dy}px)`
      }
      case 'BL': {
        return `translateX(${dx}px) translateY(calc(-100% - ${dy}px))`
      }
      case 'BR': {
        return `translateX(calc(-100% - ${dx / 2}px)) translateY(calc(-100% - ${dy}px))`
      }
    }
  })()

  return (
    <OverlayPortal z={201}>
      <OverlayContainer static position={offsetPosition} pointerEvents={false}>
        <div style={{ transform, width: 'min-content', height: 'min-content' }}>{children}</div>
      </OverlayContainer>
    </OverlayPortal>
  )
}

export default React.memo(HoverTooltip)
