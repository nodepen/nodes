import { Scene, PerspectiveCamera } from 'three'

export const getThumbnailCamera = (scene: Scene): PerspectiveCamera => {
  const camera = new PerspectiveCamera()
  camera.up.set(0, 0, 1)
  camera.position.set(-3, 3, 3)
  camera.lookAt(0, 0, 0)
  camera.aspect = 400 / 300
  camera.updateProjectionMatrix()

  return camera
}
