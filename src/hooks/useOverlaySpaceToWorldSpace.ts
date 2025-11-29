import { useCallback } from 'react'
import { useStore } from '$'
import { usePageSpaceToWorldSpace } from '.'

/**
 * @returns A callback that maps overlay coordinates to their equivalent coordinates
 * within world space (the svg context)
 */
export const useOverlaySpaceToWorldSpace = () => {
  const canvas = useStore((state) => state.registry.canvasRoot)

  const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

  const callback = useCallback(
    (overlayX: number, overlayY: number): [x: number, y: number] => {
      const container = canvas.current

      if (!container) {
        console.log(`🐍 Could not locate root container div.`)
        return [overlayX, overlayY]
      }

      const { left, top } = container.getBoundingClientRect()

      const [pageX, pageY] = [overlayX + left, overlayY + top]

      return pageSpaceToWorldSpace(pageX, pageY)
    },
    [pageSpaceToWorldSpace]
  )

  return callback
}
