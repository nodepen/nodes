import rhino3dm from 'rhino3dm'
import gl from 'gl'
import {
  Scene,
  Mesh,
  BoxBufferGeometry,
  MeshPhongMaterial,
  PlaneGeometry,
  PointLight,
  PerspectiveCamera,
  WebGL1Renderer,
  WebGLRenderTarget,
  PCFSoftShadowMap,
  LinearFilter,
  NearestFilter,
  RGBAFormat,
  UnsignedByteType,
} from 'three'
import fs from 'fs'
import { PNG } from 'pngjs'

const WIDTH = 400
const HEIGHT = 300

// Thank you @bsergean !
// https://gist.github.com/bsergean/08be90a2f21205062ccc

export const createThumbnailImage = async (): Promise<PNG> => {
  const scene = new Scene()

  const box = new Mesh(new BoxBufferGeometry(), new MeshPhongMaterial())
  box.position.set(0, 0, 1)
  box.castShadow = true
  scene.add(box)

  const ground = new Mesh(new PlaneGeometry(100, 100), new MeshPhongMaterial())
  ground.receiveShadow = true
  scene.add(ground)

  const light = new PointLight()
  light.position.set(3, 3, 5)
  light.castShadow = true
  scene.add(light)

  const camera = new PerspectiveCamera()
  camera.up.set(0, 0, 1)
  camera.position.set(-3, 3, 3)
  camera.lookAt(box.position)
  scene.add(camera)

  const width = WIDTH
  const height = HEIGHT
  const png = new PNG({ width: width, height: height })

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
