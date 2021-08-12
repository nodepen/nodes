import { useEffect } from 'react'

/**
 * Allow number sliders to override the main cursor while dragging, even if the cursor leaves the slider.
 * @remarks This feels unholy but it works so
 */
export const useCursorOverride = (override: boolean): void => {
  useEffect(() => {
    document.documentElement.style['cursor'] = override ? 'ew-resize' : 'auto'
  }, [override])
}
