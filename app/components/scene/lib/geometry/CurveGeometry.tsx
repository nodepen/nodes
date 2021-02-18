import React, { useRef } from 'react'
import { Glasshopper } from 'glib'
import { Vector3 } from 'three'

type CurveProps = {
  curve: Glasshopper.Geometry.Curve
  material?: {
    color?: string
    width?: number
  }
}

export const CurveGeometry = ({ curve, material }: CurveProps): React.ReactElement => {
  const points = curve.reduce(
    (pts, [x, y, z, ax, ay, az, ix, iy, iz, i, j, k]) => [...pts, new Vector3(x, z, -y), new Vector3(i, k, -j)],
    [] as Vector3[]
  )

  const mat = useRef()

  return (
    <mesh>
      {/* @ts-expect-error */}
      <meshLine attach="geometry" vertices={points} />
      {/* @ts-expect-error */}
      <meshLineMaterial
        attach="material"
        ref={mat}
        depthTest={false}
        lineWidth={material?.width ?? 0.03}
        color={material?.color ?? '#98e2c6'}
      />
    </mesh>
  )
}
