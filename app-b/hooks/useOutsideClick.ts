import { MutableRefObject, RefObject, useEffect } from 'react'

export const useOutsideClick = (
  target: RefObject<HTMLDivElement | HTMLButtonElement> | MutableRefObject<HTMLDivElement | HTMLButtonElement>,
  onOutsideClick: (e: MouseEvent) => void
): void => {
  useEffect(() => {
    if (!target.current) {
      return
    }

    const handlePointerDown = (e: MouseEvent): void => {
      if (target?.current && e.target && !target.current.contains(e.target as any)) {
        onOutsideClick(e)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  })
}
