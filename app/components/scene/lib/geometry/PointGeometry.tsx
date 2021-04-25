import React from 'react'
import { Sphere } from '@react-three/drei'
import { Glasshopper } from 'glib'

type PointProps = {
  point: Glasshopper.Geometry.Point
  selected: boolean
}

export const PointGeometry = ({ point, selected }: PointProps): React.ReactElement => {
  const { x, y, z } = point

  return (
    <Sphere visible args={[0.1, 10, 10]} position={[x, z, -y]}>
      <meshBasicMaterial attach="material" color={selected ? 'green' : 'darkred'} opacity={0.6} transparent={true} />
    </Sphere>
  )
}
