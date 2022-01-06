import { NodePen } from 'glib'
import {
  Color,
  BufferGeometry,
  LineBasicMaterial,
  Vector3,
  Line,
} from 'three-universal/build/three.node'
import { Remapper } from '../types'

export const convertPointsToMeshLine = (
  points: NodePen.SolutionValue['point'][],
  remap?: Remapper
): Line => {
  const lineGeometry = new BufferGeometry()
  const lineMaterial = new LineBasicMaterial({
    color: new Color(0x333333),
    linewidth: 2,
  })

  const positions: Vector3[] = []

  for (const { x, y, z } of points) {
    positions.push(
      new Vector3(remap?.x(x) ?? x, remap?.y(y) ?? y, remap?.z(z) ?? z)
    )
  }

  lineGeometry.setFromPoints(positions)

  const line = new Line(lineGeometry, lineMaterial)

  return line
}
