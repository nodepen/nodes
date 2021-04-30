import React, { useEffect, useRef } from 'react'

export const useMoveableElement = (
  onMove: (motion: [number, number]) => void,
  onMoveStart?: () => void,
  onMoveEnd?: () => void,
  ref?: React.MutableRefObject<HTMLDivElement>
): React.MutableRefObject<HTMLDivElement> => {
  const hookRef = useRef<HTMLDivElement>(null)

  const target = ref ?? hookRef

  const motionAnchor = useRef<[number, number]>([0, 0])
  const motionActive = useRef(false)

  const handlePointerDown = (e: PointerEvent): void => {
    e.stopPropagation()

    const { pageX: ex, pageY: ey } = e

    motionAnchor.current = [ex, ey]
    motionActive.current = true

    onMoveStart()
  }

  const handlePointerMove = (e: PointerEvent): void => {
    if (!motionActive.current) {
      return
    }

    const { pageX: ex, pageY: ey } = e
    const [ax, ay] = motionAnchor.current

    const motion: [number, number] = [ex - ax, -(ey - ay)]

    onMove(motion)

    motionAnchor.current = [ex, ey]
  }

  const handlePointerUp = (): void => {
    if (!motionActive.current) {
      return
    }

    motionActive.current = false

    onMoveEnd()
  }

  useEffect(() => {
    const element = target.current

    if (!element) {
      return
    }

    element.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      element.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  })

  return target
}
