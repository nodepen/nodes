import { Scene, PointLight, Vector3, Color, Box3 } from 'three'
import { NodePen, assert } from 'glib'
import { isVisible } from '../geometry/utils'
import { Remapper } from '../geometry/types'
import * as convert from '../geometry/converters'
import rhino3dm from 'rhino3dm'

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

  // Map solution data to converters
  const addSolutionToScene = async (
    scene: Scene,
    solutionData: NodePen.SolutionManifest['data'],
    remap?: Remapper
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      rhino3dm().then((rhino) => {
        for (const elementSolutionData of solutionData) {
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
                case 'circle':
                case 'curve': {
                  const curve = convert.curve(
                    rhino,
                    JSON.parse(entry.geometry as any),
                    remap
                  )
                  scene.add(curve)
                  break
                }
                case 'line': {
                  const { from, to } = JSON.parse(entry.value as any)

                  const points = [from, to]
                  const line = convert.points(points, remap)

                  scene.add(line)
                  break
                }
                case 'point': {
                  const point = convert.point(
                    JSON.parse(entry.value as any),
                    remap
                  )
                  scene.add(point)
                  break
                }
                case 'rectangle': {
                  const { corners } = JSON.parse(entry.value as any)

                  const points = [
                    corners.a,
                    corners.b,
                    corners.c,
                    corners.d,
                    corners.a,
                  ]
                  const line = convert.points(points, remap)

                  scene.add(line)
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

        resolve()
      })
    })
  }

  // First, create a scene with all geometry in true coordinate space
  const defaultScene = new Scene()
  defaultScene.up = new Vector3(0, 0, 1)
  defaultScene.updateMatrix()
  defaultScene.updateMatrixWorld()
  defaultScene.background = new Color(0xeff2f2)

  defaultScene.add(defaultLight)

  await addSolutionToScene(defaultScene, data)

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

  await addSolutionToScene(normalizedScene, data, remapper)

  return normalizedScene
}
