import React, { useRef, useEffect, useCallback } from 'react'

export const useLongPress = (
  onLongPress: (e: PointerEvent) => void,
  ref: React.MutableRefObject<HTMLDivElement> | undefined,
  delay = 500
): React.MutableRefObject<HTMLDivElement> => {
  const defaultRef = useRef<HTMLDivElement>(null)

  const target = ref ?? defaultRef

  const timer = useRef<any>(undefined)

  const handlePointerDown = useCallback(
    (e: PointerEvent): void => {
      if (e.pointerType == 'mouse') {
        return
      }

      if (timer.current) {
        clearTimeout(timer.current)
      }

      timer.current = setTimeout(() => {
        onLongPress(e)
        timer.current = undefined
      }, delay)
    },
    [delay, onLongPress]
  )

  const handlePointerUp = useCallback((): void => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = undefined
    }
  }, [])

  useEffect(() => {
    if (!target.current) {
      return
    }

    target.current.addEventListener('pointerdown', handlePointerDown)
    target.current.addEventListener('pointerup', handlePointerUp)
  }, [target, handlePointerDown, handlePointerUp])

  return target
}
