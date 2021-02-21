import React, { useRef, useEffect, useCallback } from 'react'

export const useLongHover = (
  onLongHover: (e: PointerEvent) => void,
  delay = 900
): React.MutableRefObject<HTMLDivElement> => {
  const target = useRef<HTMLDivElement>(null)

  const timer = useRef<any>(undefined)

  const handlePointerOver = useCallback(
    (e: PointerEvent): void => {
      if (e.pointerType !== 'mouse') {
        return
      }

      if (timer.current) {
        clearTimeout(timer.current)
      }

      timer.current = setTimeout(() => {
        onLongHover(e)
      }, delay)
    },
    [delay, onLongHover]
  )

  const handlePointerOut = useCallback((): void => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = undefined
    }
  }, [])

  useEffect(() => {
    if (!target.current) {
      return
    }

    target.current.addEventListener('pointerover', handlePointerOver)
    target.current.addEventListener('pointerout', handlePointerOut)
  }, [target, handlePointerOver, handlePointerOut])

  return target
}
