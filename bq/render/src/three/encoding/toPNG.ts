import { Scene, Camera, WebGL1Renderer } from 'three'
import { PNG } from 'pngjs'

const DEFAULT_WIDTH = 400
const DEFAULT_HEIGHT = 300

const width = DEFAULT_WIDTH
const height = DEFAULT_HEIGHT

export const toPNG = (
  scene: Scene,
  camera: Camera,
  renderer: WebGL1Renderer
): PNG => {
  renderer.render(scene, camera)

  const context = renderer.getContext()

  const frameBufferPixels = new Uint8Array(width * height * 4)
  context.readPixels(
    0,
    0,
    width,
    height,
    context.RGBA,
    context.UNSIGNED_BYTE,
    frameBufferPixels
  )

  const png = new PNG({ width: width, height: height })

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const k = j * width + i
      const r = frameBufferPixels[4 * k]
      const g = frameBufferPixels[4 * k + 1]
      const b = frameBufferPixels[4 * k + 2]
      const a = frameBufferPixels[4 * k + 3]

      const m = (height - j + 1) * width + i
      png.data[4 * m] = r
      png.data[4 * m + 1] = g
      png.data[4 * m + 2] = b
      png.data[4 * m + 3] = a
    }
  }

  return png
}
