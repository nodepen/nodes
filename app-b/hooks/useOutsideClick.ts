import { MutableRefObject, RefObject, useEffect } from 'react'

export const useOutsideClick = (
  target: RefObject<HTMLDivElement | HTMLButtonElement> | MutableRefObject<HTMLDivElement | HTMLButtonElement>,
  onOutsideClick: (e: MouseEvent) => void
): void => {
  useEffect(() => {
    if (!target.current) {
      return
    }

    const handleMouseDown = (e: MouseEvent): void => {
      if (target?.current && e.target && !target.current.contains(e.target as any)) {
        onOutsideClick(e)
      }
    }

    const handlePointerDown = (e: MouseEvent): void => {
      if (e.type === 'click') {
        return
      }

      if (target?.current && e.target && !target.current.contains(e.target as any)) {
        onOutsideClick(e)
      }
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  })
}
