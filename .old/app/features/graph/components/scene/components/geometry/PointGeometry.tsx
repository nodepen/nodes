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

  return (
    <Sphere args={[0.125, 10, 10]} position={[x, y, z]}>
      <meshBasicMaterial
        attach="material"
        color={material?.color ?? 'darkred'}
        opacity={material?.opacity ?? 0.7}
        transparent={true}
      />
    </Sphere>
  )
}
