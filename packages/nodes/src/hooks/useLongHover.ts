import React, { useRef, useCallback } from 'react'
import { useImperativeEvent } from './useImperativeEvent'

export const useLongHover = <T extends HTMLDivElement | SVGGElement>(
  onLongHoverCallback: (e: PointerEvent) => void,
  hoverDelay = 300
): React.RefObject<T> => {
  const targetRef = useRef<T>(null)

  const delayTimeout = useRef<ReturnType<typeof setTimeout>>()

  const handlePointerMove = useCallback(
    (e: PointerEvent): void => {
      if (e.pointerType !== 'mouse') {
        // `useLongHover` only applies to mouse interactions
        return
      }

      if (delayTimeout.current) {
        clearTimeout(delayTimeout.current)
      }

      const debounce = setTimeout(() => {
        onLongHoverCallback(e)
      }, hoverDelay)

      delayTimeout.current = debounce
    },
    [onLongHoverCallback, hoverDelay]
  )

  const handlePointerLeave = useCallback((e: PointerEvent): void => {
    if (e.pointerType !== 'mouse') {
      return
    }

    if (delayTimeout.current) {
      clearTimeout(delayTimeout.current)
    }
  }, [])

  useImperativeEvent(targetRef, 'pointermove', handlePointerMove)
  useImperativeEvent(targetRef, 'pointerleave', handlePointerLeave)

  return targetRef
}
