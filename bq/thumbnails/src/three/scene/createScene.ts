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
import { NodePen } from 'glib'

const WIDTH = 400
const HEIGHT = 300

// Thank you @bsergean !
// https://gist.github.com/bsergean/08be90a2f21205062ccc

export const createScene = async (
  solution: NodePen.SolutionManifest
): Promise<Scene> => {
  const { data } = solution

  const scene = new Scene()

  const width = WIDTH
  const height = HEIGHT

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

  return scene
}
