import React, { useEffect, useRef } from 'react'

export const useSelectableElement = (
  onSelect: () => void,
  ref?: React.MutableRefObject<HTMLDivElement>
): React.MutableRefObject<HTMLDivElement> => {
  const hookRef = useRef<HTMLDivElement>(null)

  const target = ref ?? hookRef

  const pointerStart = useRef(0)

  const handlePointerDown = (): void => {
    const now = Date.now()

    pointerStart.current = now
  }

  const handlePointerUp = (): void => {
    const pointerDuration = Date.now() - pointerStart.current

    if (pointerDuration < 250) {
      onSelect()
    }
  }

  useEffect(() => {
    if (!target.current) {
      return
    }

    const element = target.current

    element.addEventListener('pointerdown', handlePointerDown)
    element.addEventListener('pointerup', handlePointerUp)

    return () => {
      element.removeEventListener('pointerdown', handlePointerDown)
      element.removeEventListener('pointerup', handlePointerUp)
    }
  })

  return target
}
