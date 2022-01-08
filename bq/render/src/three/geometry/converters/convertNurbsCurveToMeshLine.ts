import { RhinoModule } from 'rhino3dm'
import { NodePen } from 'glib'
import { Color, BufferGeometry, LineBasicMaterial, Vector3, Line } from 'three'
import { Remapper } from '../types'

export const convertNurbsCurveToMeshLine = (
  rhino: RhinoModule,
  curve: NodePen.DataTreeValue<'curve' | 'circle'>['geometry'],
  remap?: Remapper
): Line => {
  const lineGeometry = new BufferGeometry()
  const lineMaterial = new LineBasicMaterial({
    color: new Color(0x333333) as any,
    linewidth: 2,
  })

  /* eslint-disable */
  /* @ts-expect-error `decode` type is incorrect */
  const geo: typeof rhino.NurbsCurve['prototype'] = rhino.CommonObject.decode(curve)
  /* eslint-enable */

  const POINT_COUNT = 100

  const domain = geo.domain
  const divisions = Math.max(POINT_COUNT - 1, Math.round(domain?.[1] * 5 ?? 0))

  const ts: number[] = []

  for (let j = 0; j < divisions; j++) {
    const t = domain[0] + (j / divisions) * (domain[1] - domain[0])

    if (t === domain[0] || t === domain[1]) {
      ts.push(t)
      continue
    }

    const tan = geo.tangentAt(t)
    const prevTan = geo.tangentAt(ts.slice(-1)[0])

    const tS = tan[0] * tan[0] + tan[1] * tan[1] + tan[2] * tan[2]
    const ptS =
      prevTan[0] * prevTan[0] +
      prevTan[1] * prevTan[1] +
      prevTan[2] * prevTan[2]
    const denominator = Math.sqrt(tS * ptS)
    let angle

    if (denominator === 0) {
      angle = Math.PI / 2
    } else {
      const theta =
        (tan[0] * prevTan[0] + tan[1] * prevTan[1] + tan[2] * prevTan[2]) /
        denominator
      angle = Math.acos(Math.max(-1, Math.min(1, theta)))
    }

    if (angle < 0.1) continue
    ts.push(t)
  }

  ts.push(domain[0])

  const positions: Vector3[] = []

  for (const t of ts) {
    const [x, y, z] = geo.pointAt(t)

    positions.push(
      new Vector3(remap?.x(x) ?? x, remap?.y(y) ?? y, remap?.z(z) ?? z)
    )
  }

  lineGeometry.setFromPoints(positions)

  const line = new Line(lineGeometry, lineMaterial)

  return line
}
