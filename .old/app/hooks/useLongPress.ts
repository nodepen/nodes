import { distance } from '@/features/graph/utils'
import React, { useEffect, useRef, useCallback } from 'react'

export const useLongPress = (
  onLongPress: (e: PointerEvent) => void,
  delay = 600,
  /**
   * Note to Chuck: Using this breaks things. Best to toggle flags with long press, then block the later events.
   */
  stopPropagationOnStart = false
): React.RefObject<HTMLDivElement> => {
  const target = useRef<HTMLDivElement>(null)

  const longPressActive = useRef<boolean>(false)
  const longPressPointerId = useRef<number | undefined>(undefined)
  const longPressStartTime = useRef<number>(0)
  const longPressStartPosition = useRef<[number, number]>([0, 0])

  const longPressTimeout = useRef<number>(0)

  const resetState = useCallback((): void => {
    longPressActive.current = false
    longPressPointerId.current = undefined
    clearTimeout(longPressTimeout.current)
  }, [])

  const handlePointerDown = useCallback(
    (e: PointerEvent): void => {
      if (longPressActive.current) {
        return
      }

      if (!target.current) {
        return
      }

      if (!e.target) {
        return
      }

      if (!target.current.contains(e.target as any)) {
        return
      }

      if (e.pointerType === 'mouse') {
        // Ignore mouse events, long press is touch only
        return
      }

      e.preventDefault()

      if (stopPropagationOnStart) {
        e.stopPropagation()
      }

      clearTimeout(longPressTimeout.current)

      const { pageX, pageY } = e

      longPressActive.current = true
      longPressPointerId.current = e.pointerId
      longPressStartTime.current = Date.now()
      longPressStartPosition.current = [pageX, pageY]

      const timeout = setTimeout(() => {
        if (!longPressActive.current) {
          return
        }

        try {
          window.navigator.vibrate(50)
        } catch {
          // Do nothing
        }

        onLongPress(e)

        resetState()
      }, delay)

      longPressTimeout.current = timeout as any
    },
    [onLongPress, delay, resetState, stopPropagationOnStart]
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent): void => {
      if (!longPressActive.current) {
        return
      }

      const { pageX: bx, pageY: by } = e

      const [ax, ay] = longPressStartPosition.current

      const dist = distance([ax, ay], [bx, by])

      if (dist > 15) {
        // Cancel long press
        resetState()
      }
    },
    [resetState]
  )

  const handlePointerUp = useCallback(
    (e: PointerEvent): void => {
      if (e.pointerId !== longPressPointerId.current) {
        // Pointer is not relevant, do nothing
        return
      }

      resetState()
    },
    [resetState]
  )

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>): void => {
    e.preventDefault()
  }, [])

  useEffect(() => {
    if (!target.current) {
      return
    }

    // const el = target.current

    window.addEventListener('touchstart', handleTouchStart as any)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart as any)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  })

  return target
}
