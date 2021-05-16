import { useCameraPosition } from './useCameraPosition'
import { useCameraZoom } from './useCameraZoom'

type GridDimensions = {
  size: number
  thickness: number
  position: [number, number]
}

export const useGridDimensions = (): GridDimensions => {
  const [cx, cy] = useCameraPosition()
  const zoom = useCameraZoom()

  const scale = zoom < 0.5 ? 5 : 1

  return {
    size: 25 * zoom * scale,
    thickness: 0.3 * zoom,
    position: [cx % (25 * zoom * scale), cy % (25 * zoom * scale)],
  }
}
