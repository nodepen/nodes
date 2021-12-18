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
  Vector3,
  Color,
} from 'three'
import { NodePen } from 'glib'

const WIDTH = 400
const HEIGHT = 300

// Thank you @bsergean !
// https://gist.github.com/bsergean/08be90a2f21205062ccc

export const createScene = async (
  graph: NodePen.GraphElementsArray,
  solution: NodePen.SolutionManifest
): Promise<Scene> => {
  const { data } = solution

  // First, create a scene with all geometry in true coordinate space
  const defaultScene = new Scene()
  defaultScene.up = new Vector3(0, 0, 1)
  defaultScene.updateMatrix()
  defaultScene.updateMatrixWorld()
  defaultScene.background = new Color(0xeff2f2)

  for (const element of data) {
    const { elementId, values } = element

    // Check element visibility

    for (const parameter of values) {
      const { data: branch } = parameter

      for (const entry of branch) {
        switch (entry.type) {
          // Convert rhino geometry to threejs geometry
          case 'point': {
            break
          }
          default: {
            break
          }
        }
      }
    }
  }

  const width = WIDTH
  const height = HEIGHT

  const box = new Mesh(new BoxBufferGeometry(), new MeshPhongMaterial())
  box.position.set(0, 0, 1)
  box.castShadow = true
  scene.add(box)

  const light = new PointLight()
  light.position.set(3, 3, 5)
  light.castShadow = true
  scene.add(light)

  return scene
}
