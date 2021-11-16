import React, { useLayoutEffect, useRef } from 'react'
import rhino3dm from 'rhino3dm'
import { NodePen } from 'glib'
import { MeshMaterial } from '../../types'

type CurveGeometryProps = {
  curve: NodePen.DataTreeValue<'curve' | 'circle'>['geometry']
  material?: MeshMaterial & { width?: number }
}

export const CurveGeometry = ({ curve, material }: CurveGeometryProps): React.ReactElement => {
  const { color, width, opacity } = material ?? {}

  const lineGeometryRef = useRef<any>(null)

  useLayoutEffect(() => {
    rhino3dm().then((rhino) => {
      /* @ts-expect-error `decode` type is incorrect */
      const geo: typeof rhino.NurbsCurve['prototype'] = rhino.CommonObject.decode(curve)

      console.log(geo.domain)
      const POINT_COUNT = 100

      const domain = geo.domain
      const divisions = POINT_COUNT - 1

      const ts: number[] = []

      for (let j = 0; j < POINT_COUNT; j++) {
        const t = domain[0] + (j / divisions) * (domain[1] - domain[0])

        if (t === domain[0] || t === domain[1]) {
          ts.push(t)
          continue
        }

        const tan = geo.tangentAt(t)
        const prevTan = geo.tangentAt(ts.slice(-1)[0]) // Duplicated from THREE.Vector3
        // How to pass imports to worker?

        const tS = tan[0] * tan[0] + tan[1] * tan[1] + tan[2] * tan[2]
        const ptS = prevTan[0] * prevTan[0] + prevTan[1] * prevTan[1] + prevTan[2] * prevTan[2]
        const denominator = Math.sqrt(tS * ptS)
        let angle

        if (denominator === 0) {
          angle = Math.PI / 2
        } else {
          const theta = (tan.x * prevTan.x + tan.y * prevTan.y + tan.z * prevTan.z) / denominator
          angle = Math.acos(Math.max(-1, Math.min(1, theta)))
        }

        if (angle < 0.1) continue
        ts.push(t)
      }

      const positions: number[] = []

      for (const t of ts) {
        const p = geo.pointAt(t)
        positions.push(...p)
      }

      lineGeometryRef.current?.setPositions(positions)
    })
  }, [curve])

  return (
    <>
      {/* @ts-expect-error `line2` does not publish types */}
      <line2>
        {/* @ts-expect-error `line2` does not publish types */}
        <lineGeometry ref={lineGeometryRef} />
        {/* @ts-expect-error `line2` does not publish types */}
        <lineMaterial
          color={color ?? 'darkred'}
          linewidth={width ?? 0.2}
          worldUnits={true}
          opacity={opacity ?? 0.7}
          transparent={true}
        />
        {/* @ts-expect-error `line2` does not publish types */}
      </line2>
    </>
  )
}
