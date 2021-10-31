import React from 'react'
import { Sphere } from '@react-three/drei'
import { NodePen } from 'glib'

type PointGeometryProps = {
  point: NodePen.GH.Point
}

export const PointGeometry = ({ point }: PointGeometryProps): React.ReactElement => {
  const { x, y, z } = point

  return (
    <Sphere args={[1, 10, 10]} position={[x, y, z]}>
      <meshBasicMaterial attach="material" color="green" />
    </Sphere>
  )
}
