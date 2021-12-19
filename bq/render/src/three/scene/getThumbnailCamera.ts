import { OrthographicCamera, Vector3 } from 'three'

export const getThumbnailCamera = (): OrthographicCamera => {
  const aspect = 400 / 300

  const left = -aspect
  const right = aspect
  const top = 1
  const bottom = -1
  const near = -5
  const far = 50
  const camera = new OrthographicCamera(left, right, top, bottom, near, far)
  camera.zoom = 2

  camera.up.set(0, 0, 1)
  camera.position.set(-2, -2, 2)
  camera.lookAt(new Vector3(0, 0, 0))

  camera.updateProjectionMatrix()

  return camera
}
