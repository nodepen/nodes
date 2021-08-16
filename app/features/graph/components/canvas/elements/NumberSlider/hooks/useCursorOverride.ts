import { useState, useEffect } from 'react'

/**
 * Allow number sliders to override the main cursor while dragging, even if the cursor leaves the slider.
 * @remarks This feels unholy but it works so
 */
export const useCursorOverride = (): ((active: boolean) => void) => {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    document.documentElement.style['cursor'] = isActive ? 'ew-resize' : 'auto'
  }, [isActive])

  return (active: boolean) => setIsActive(active)
}
