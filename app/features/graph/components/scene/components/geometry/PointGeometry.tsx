import React from 'react'
import { Sphere } from '@react-three/drei'
import { NodePen } from 'glib'
import { MeshMaterial } from '../../types'

type PointGeometryProps = {
  point: NodePen.GH.Point
  material?: MeshMaterial
}

export const PointGeometry = ({ point, material }: PointGeometryProps): React.ReactElement => {
  const { x, y, z } = point

  const color = material?.color ?? 'darkred'
  const opacity = material?.opacity ?? 0.5

  return (
    <Sphere args={[0.25, 10, 10]} position={[x, y, z]}>
      <meshBasicMaterial attach="material" color={color} opacity={opacity} transparent={opacity < 1} />
    </Sphere>
  )
}
