import {
  Scene,
  Camera,
  WebGL1Renderer,
  WebGLRenderTarget,
  PCFSoftShadowMap,
  LinearFilter,
  NearestFilter,
  RGBAFormat,
  UnsignedByteType,
} from 'three'
import { PNG } from 'pngjs'
import gl from 'gl'

const DEFAULT_WIDTH = 400
const DEFAULT_HEIGHT = 300

export const toPNG = (scene: Scene, camera: Camera): PNG => {
  const width = DEFAULT_WIDTH
  const height = DEFAULT_HEIGHT

  const canvas = {
    width,
    height,
    addEventListener: () => {
      /* ok */
    },
    removeEventListener: () => {
      /* ok */
    },
  }

  const renderer = new WebGL1Renderer({
    canvas,
    antialias: false,
    powerPreference: 'high-performance',
    context: gl(width, height, {
      preserveDrawingBuffer: true,
    }),
  })

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap // default PCFShadowMap

  // This is important to enable shadow mapping. For more see:
  // https://threejsfundamentals.org/threejs/lessons/threejs-rendertargets.html and
  // https://threejsfundamentals.org/threejs/lessons/threejs-shadows.html
  const renderTarget = new WebGLRenderTarget(width, height, {
    minFilter: LinearFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    type: UnsignedByteType,
  })

  renderer.setRenderTarget(renderTarget)

  renderer.render(scene, camera)

  const context = renderer.getContext()

  // width = context.drawingBufferWidth
  // height = context.drawingBufferHeight
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
