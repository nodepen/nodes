import { useCallback } from 'react'
import { screenSpaceToCameraSpace } from '../utils'
import { useCameraStaticPosition, useCameraStaticZoom } from '../store/camera/hooks'

/**
 * Utility hook
 * @returns
 */
export const useScreenSpaceToCameraSpace = (): ((
  screenPosition: [number, number],
  screenOffset?: [number, number]
) => [number, number]) => {
  const cameraPosition = useCameraStaticPosition()
  const cameraZoom = useCameraStaticZoom()

  const callback = useCallback(
    (screenPosition: [number, number], screenOffset: [number, number] = [0, 48 + 40]): [number, number] => {
      const [cx, cy] = cameraPosition
      const [ex, ey] = screenPosition
      const [x, y] = screenSpaceToCameraSpace(
        { offset: screenOffset, position: [ex, ey] },
        { zoom: cameraZoom, position: [cx, cy] }
      )

      return [x, y]
    },
    [cameraPosition, cameraZoom]
  )

  return callback
}
