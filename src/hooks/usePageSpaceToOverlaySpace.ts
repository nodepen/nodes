import { useCallback } from 'react'
import { useStore } from '$'

/**
 * @returns A callback that maps page coordinates to their equivalent coordinates
 * within the root container div.
 */
export const usePageSpaceToOverlaySpace = () => {
  const canvas = useStore((state) => state.registry.canvasRoot)

  const callback = useCallback((pageX: number, pageY: number): [x: number, y: number] => {
    const container = canvas.current

    if (!container) {
      console.log(`🐍 Could not locate root container div.`)
      return [pageX, pageY]
    }

    const { left, top } = container.getBoundingClientRect()

    return [pageX - left, pageY - top]
  }, [])

  return callback
}
