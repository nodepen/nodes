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
  Sphere,
  SphereGeometry,
  MeshBasicMaterial,
} from 'three'
import { NodePen, assert } from 'glib'

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

  const light = new PointLight()
  light.position.set(3, 3, 5)
  light.castShadow = true
  defaultScene.add(light)

  const defaultMaterial = new MeshPhongMaterial()

  for (const elementSolutionData of data) {
    const { elementId, parameterId, values } = elementSolutionData

    // Check element visibility
    const element = graph.find((el) => el.id === elementId)

    if (!element || !assert.element.isGraphElement(element.current)) {
      console.log('🐍 Element does not exist!')
      continue
    }

    const { current: elementState } = element

    if (!assert.element.isGraphElement(elementState)) {
      console.log('🐍 Element does not contain data!')
      continue
    }

    const { settings, outputs } = elementState

    if (settings.visibility !== 'visible') {
      console.log('🐍 Element is not visible!')
      continue
    }

    if (!Object.keys(outputs).includes(parameterId)) {
      console.log('🐍 Element is an input!')
      continue
    }

    for (const parameter of values) {
      const { data: branch } = parameter

      for (const entry of branch) {
        switch (entry.type) {
          // Convert rhino geometry to threejs geometry
          case 'point': {
            const { x, y, z } = JSON.parse(entry.value as unknown as string)

            const pointGeometry = new SphereGeometry(0.5, 100, 100)
            const point = new Mesh(pointGeometry, defaultMaterial)

            point.position.set(x, y, z)
            point.castShadow = true

            defaultScene.add(point)
            break
          }
          default: {
            // Value is not visible geometry
            // console.log(`Cannot visualize value of type ${entry.type}.`)
            break
          }
        }
      }
    }
  }

  // Calculate the bounding box of all visible geometry

  // Determine how values will be remapped to a 1 x 1 x 1 cube

  // Second, create a scene with all geometry mapped to normalized coordinate space

  return defaultScene
}
