import { PerspectiveCamera } from 'three'

export const setCameraOrbit = (
  camera: PerspectiveCamera,
  target: [number, number, number],
  distance: number,
  degrees: number
): void => {
  const rad = degrees * (Math.PI / 180)

  const x = distance * Math.cos(rad)
  const y = distance * Math.sin(rad)

  camera.position.set(x, y, 3)

  const [tx, ty, tz] = target
  camera.lookAt(tx, ty, tz)

  camera.updateProjectionMatrix()
}
