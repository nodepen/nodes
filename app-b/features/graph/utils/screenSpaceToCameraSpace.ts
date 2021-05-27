type ScreenBasis = {
  offset: [number, number]
  position: [number, number]
}

type CameraBasis = {
  zoom: number
  position: [number, number]
}

/**
 * Given coordinates in screen space, return their equivalent in current camera space.
 * @param screen
 * @param camera
 */
export const screenSpaceToCameraSpace = (screen: ScreenBasis, camera: CameraBasis): [number, number] => {
  const {
    offset: [dx, dy],
    position: [sx, sy],
  } = screen
  const {
    zoom,
    position: [cx, cy],
  } = camera

  const x = (sx - dx) / zoom - cx / zoom
  const y = (sy - dy) / zoom - cy / zoom

  return [x, y]
}
