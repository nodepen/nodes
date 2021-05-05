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
  const { degree, segments } = curve

  const points = segments.reduce((pts, points) => {
    const [x, y, z, ax, ay, az, ix, iy, iz, i, j, k] = points
    switch (degree) {
      case 1:
        return [...pts, new Vector3(x, z, -y), new Vector3(i, k, -j)]
      default:
        return [...pts, ...sample([x, y, z, ax, ay, az, ix, iy, iz, i, j, k])]
    }
  }, [] as Vector3[])

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
        lineWidth={material?.width ?? 0.1}
        color={material?.color ?? 'darkred'}
      />
    </mesh>
  )
}

const sample = (
  segment: [number, number, number, number, number, number, number, number, number, number, number, number]
): Vector3[] => {
  const [ax, ay, az, ix, iy, iz, jx, jy, jz, bx, by, bz] = segment

  const distance = distanceTo([ax, ay, az], [bx, by, bz])

  const sampleCount = Math.max(distance / 5, 10)

  const samples: [number, number, number][] = []

  for (let i = 0; i < sampleCount; i++) {
    const t = (1 / (sampleCount - 1)) * i

    const [lx, ly, lz] = pointAt([ax, ay, az], [ix, iy, iz], t)
    const [rx, ry, rz] = pointAt([jx, jy, jz], [bx, by, bz], t)

    const [x, y, z] = pointAt([lx, ly, lz], [rx, ry, rz], t)

    samples.push([x, y, z])
  }

  return samples.map(([x, y, z]) => new Vector3(x, z, -y))
}

const distanceTo = (from: [number, number, number], to: [number, number, number]): number => {
  const [ax, ay, az] = from
  const [bx, by, bz] = to

  const distance = Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2) + Math.pow(az - bz, 2))

  return distance
}

const pointAt = (
  start: [number, number, number],
  end: [number, number, number],
  t: number
): [number, number, number] => {
  const [ax, ay, az] = start
  const [bx, by, bz] = end

  const [x, y, z] = [ax - bx, ay - by, az - bz]

  return [x * t + ax, y * t + ay, z * t + az]
}
