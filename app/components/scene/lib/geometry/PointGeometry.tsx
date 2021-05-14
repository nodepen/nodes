import React from 'react'
import { Sphere } from '@react-three/drei'
import { Glasshopper } from 'glib'
import { DrawMaterial } from '../types'

type PointProps = {
  point: Glasshopper.Geometry.Point
  material: DrawMaterial
}

export const PointGeometry = ({ point, material }: PointProps): React.ReactElement => {
  const { x, y, z } = point

  return (
    <Sphere visible args={[0.1, 10, 10]} position={[x, z, -y]}>
      <meshBasicMaterial
        attach="material"
        color={material.color}
        opacity={material.opacity}
        transparent={material.opacity < 1}
      />
    </Sphere>
  )
}
