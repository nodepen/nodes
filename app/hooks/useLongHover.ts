import React, { useRef, useCallback, useEffect } from 'react'

export const useLongHover = (onLongHover: () => void, delay = 300): React.RefObject<HTMLDivElement> => {
  const targetRef = useRef<HTMLDivElement>(null)

  const debounceHandler = useRef<ReturnType<typeof setTimeout>>()

  const handlePointerMove = useCallback(
    (e: PointerEvent): void => {
      if (e.pointerType !== 'mouse') {
        // `useLongHover` only applies to mouse interactions
        return
      }

      if (debounceHandler.current) {
        clearTimeout(debounceHandler.current)
      }

      const debounce = setTimeout(() => {
        onLongHover()
      }, delay)

      debounceHandler.current = debounce
    },
    [onLongHover, delay]
  )

  const handlePointerLeave = useCallback((e: PointerEvent): void => {
    if (e.pointerType !== 'mouse') {
      return
    }

    if (debounceHandler.current) {
      clearTimeout(debounceHandler.current)
    }
  }, [])

  useEffect(() => {
    const target = targetRef.current

    if (!target) {
      return
    }

    target.addEventListener('pointermove', handlePointerMove)
    target.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      target.removeEventListener('pointermove', handlePointerMove)
      target.removeEventListener('pointerleave', handlePointerLeave)
    }
  })

  return targetRef
}
