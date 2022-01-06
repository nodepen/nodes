import { OrthographicCamera } from 'three'

export const setCameraOrbit = (
  camera: OrthographicCamera,
  degrees: number
): void => {
  const rad = degrees * (Math.PI / 180)

  const distance = 3
  const x = distance * Math.cos(rad)
  const y = distance * Math.sin(rad)

  camera.position.set(x, y, distance * 0.75)

  camera.lookAt(0, 0, 0)

  camera.updateProjectionMatrix()
}
