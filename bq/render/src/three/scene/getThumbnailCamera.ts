import { Scene, PerspectiveCamera } from 'three'

export const getThumbnailCamera = (): PerspectiveCamera => {
  const camera = new PerspectiveCamera()
  camera.up.set(0, 0, 1)
  camera.position.set(-10, 10, 10)
  camera.lookAt(0, 0, 0)
  camera.aspect = 400 / 300
  camera.updateProjectionMatrix()

  return camera
}

// export const getThumbnailCamera = (): OrthographicCamera => {
//   const aspect = 400 / 300
//   const frustumSize = 10

//   const camera = new OrthographicCamera(
//     (0.5 * frustumSize * aspect) / -2,
//     (0.5 * frustumSize * aspect) / 2,
//     frustumSize / 2,
//     frustumSize / -2,
//     10,
//     100
//   )

//   camera.up.set(0, 0, 1)

//   camera.position.set(1, 1, 1)
//   camera.lookAt(0, 0, 0)

//   camera.updateProjectionMatrix()

//   return camera
// }
