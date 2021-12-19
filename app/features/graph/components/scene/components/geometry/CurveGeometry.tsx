import React, { useContext, useLayoutEffect, useRef } from 'react'
import { NodePen } from 'glib'
import { MeshMaterial } from '../../types'
import { RhinoContext } from '../../SceneElements'

type CurveGeometryProps = {
  curve: NodePen.DataTreeValue<'curve' | 'circle'>['geometry']
  material?: MeshMaterial & { width?: number }
}

export const CurveGeometry = ({ curve, material }: CurveGeometryProps): React.ReactElement => {
  const { color, width, opacity } = material ?? {}

  const { module: rhino } = useContext(RhinoContext)

  const lineGeometryRef = useRef<any>(null)

  useLayoutEffect(() => {
    if (!rhino) {
      console.log('🐍 Could not find reference to compiled rhino wasm!')
      return
    }

    /* @ts-expect-error `decode` type is incorrect */
    const geo: typeof rhino.NurbsCurve['prototype'] = rhino.CommonObject.decode(curve)

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
      const ptS = prevTan[0] * prevTan[0] + prevTan[1] * prevTan[1] + prevTan[2] * prevTan[2]
      const denominator = Math.sqrt(tS * ptS)
      let angle

      if (denominator === 0) {
        angle = Math.PI / 2
      } else {
        const theta = (tan[0] * prevTan[0] + tan[1] * prevTan[1] + tan[2] * prevTan[2]) / denominator
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
  }, [curve, rhino])

  return (
    <>
      {/* @ts-expect-error `line2` does not publish types */}
      <line2>
        {/* @ts-expect-error `line2` does not publish types */}
        <lineGeometry ref={lineGeometryRef} />
        {/* @ts-expect-error `line2` does not publish types */}
        <lineMaterial
          color={color ?? 'darkred'}
          linewidth={3}
          worldUnits={false}
          resolution={[window.innerWidth, window.innerHeight]}
          opacity={opacity ?? 0.7}
          transparent={true}
        />
        {/* @ts-expect-error `line2` does not publish types */}
      </line2>
    </>
  )
}
