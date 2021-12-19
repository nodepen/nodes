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
  Box3,
  Line,
  BufferGeometry,
  LineBasicMaterial,
} from 'three'
import { NodePen, assert } from 'glib'
import { isVisible } from '../geometry/utils'
import { Remapper } from '../geometry/types'
import * as convert from '../geometry/converters'

const WIDTH = 400
const HEIGHT = 300

// Thank you @bsergean !
// https://gist.github.com/bsergean/08be90a2f21205062ccc

export const createScene = async (
  graph: NodePen.GraphElementsArray,
  solution: NodePen.SolutionManifest
): Promise<Scene> => {
  const { data } = solution

  // Create defaults
  const defaultLight = new PointLight(new Color(0xffffff), 0.4)
  defaultLight.position.set(-3, 3, 5)
  defaultLight.castShadow = true

  // First, create a scene with all geometry in true coordinate space
  const defaultScene = new Scene()
  defaultScene.up = new Vector3(0, 0, 1)
  defaultScene.updateMatrix()
  defaultScene.updateMatrixWorld()
  defaultScene.background = new Color(0xeff2f2)

  defaultScene.add(defaultLight)

  for (const elementSolutionData of data) {
    const { elementId, parameterId, values } = elementSolutionData

    // Check element visibility
    if (!isVisible(elementId, parameterId, graph)) {
      continue
    }

    for (const parameter of values) {
      const { data: branch } = parameter

      for (const entry of branch) {
        switch (entry.type) {
          // Convert rhino geometry to threejs geometry
          case 'point': {
            const point = convert.point(JSON.parse(entry.value as any))
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
  const sceneBoundingBox = new Box3()

  defaultScene.traverse((obj) => {
    sceneBoundingBox.expandByObject(obj)
  })

  const { min, max } = sceneBoundingBox

  // Determine how values will be remapped to a 1 x 1 x 1 cube
  const remap = (
    n: number,
    sourceDomain: [min: number, max: number],
    targetDomain: [min: number, max: number] = [-0.5, 0.5]
  ): number => {
    const [sourceMin, sourceMax] = sourceDomain
    const sourceRange = Math.abs(sourceMax - sourceMin)

    const [targetMin, targetMax] = targetDomain
    const targetRange = Math.abs(targetMax - targetMin)

    const t = (n - sourceMin) / sourceRange

    const targetValue = targetRange * t + targetMin

    return targetValue
  }

  // Preserve aspect ratio during remapping
  const rangeX = Math.abs(max.x - min.x)
  const rangeY = Math.abs(max.y - min.y)
  const rangeZ = Math.abs(max.z - min.z)

  const maxRange = Math.max(rangeX, rangeY, rangeZ)

  const dx = (maxRange - rangeX) / 2
  const dy = (maxRange - rangeY) / 2
  const dz = (maxRange - rangeZ) / 2

  const remapper = {
    x: (n: number) => remap(n, [min.x - dx, max.x + dx]),
    y: (n: number) => remap(n, [min.y - dy, max.y + dy]),
    z: (n: number) => remap(n, [min.z - dz, max.z + dz]),
  }

  // Second, create a scene with all geometry mapped to normalized coordinate space
  const normalizedScene = new Scene()
  normalizedScene.up = new Vector3(0, 0, 1)
  normalizedScene.updateMatrix()
  normalizedScene.updateMatrixWorld()
  normalizedScene.background = new Color(0xeff2f2)

  normalizedScene.add(defaultLight)

  for (const elementSolutionData of data) {
    const { elementId, parameterId, values } = elementSolutionData

    // Check element visibility
    if (!isVisible(elementId, parameterId, graph)) {
      continue
    }

    for (const parameter of values) {
      const { data: branch } = parameter

      for (const entry of branch) {
        switch (entry.type) {
          // Convert rhino geometry to threejs geometry
          case 'point': {
            const point = convert.point(
              JSON.parse(entry.value as any),
              remapper
            )
            normalizedScene.add(point)
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

  // const xAxisGeo = new BufferGeometry()
  // xAxisGeo.setFromPoints([
  //   new Vector3(remapper.x(0), remapper.y(0), remapper.z(0)),
  //   new Vector3(remapper.x(1), remapper.y(0), remapper.z(0)),
  // ])

  // const xAxis = new Line(
  //   xAxisGeo,
  //   new LineBasicMaterial({ color: new Color(0x000000) })
  // )

  // normalizedScene.add(xAxis)

  // const yAxisGeo = new BufferGeometry()
  // yAxisGeo.setFromPoints([
  //   new Vector3(remapper.x(0), remapper.y(0), remapper.z(0)),
  //   new Vector3(remapper.x(0), remapper.y(1), remapper.z(0)),
  // ])

  // const yAxis = new Line(
  //   yAxisGeo,
  //   new LineBasicMaterial({ color: new Color(0x000000) })
  // )

  // normalizedScene.add(yAxis)

  return normalizedScene
}
