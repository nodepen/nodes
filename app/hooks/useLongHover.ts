import React, { useState, useRef, useEffect, useCallback } from 'react'

type LongHoverStatus = {
  active: boolean
  position: [number, number]
}

export const useLongHover = (target: React.MutableRefObject<HTMLElement>, delay = 1500): LongHoverStatus => {
  const [active, setActive] = useState(false)
  const [position, setPosition] = useState<[number, number]>([0, 0])

  const timer = useRef<any>(undefined)

  const handlePointerOver = useCallback(
    (e: PointerEvent): void => {
      if (e.pointerType !== 'mouse') {
        return
      }

      if (active) {
        setActive(false)
      }

      if (timer.current) {
        clearTimeout(timer.current)
      }

      timer.current = setTimeout(() => {
        setActive(true)
      }, delay)

      const { pageX, pageY } = e

      setPosition([pageX, pageY])
    },
    [active, delay]
  )

  const handlePointerOut = useCallback((): void => {
    if (active) {
      setActive(false)
    }

    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = undefined
    }
  }, [active])

  useEffect(() => {
    if (!target.current) {
      return
    }

    target.current.addEventListener('pointerover', handlePointerOver)
    target.current.addEventListener('pointerout', handlePointerOut)
  }, [target, handlePointerOver, handlePointerOut])

  return { active, position }
}
