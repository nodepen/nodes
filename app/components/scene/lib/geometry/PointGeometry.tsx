import React from 'react'
import { Vector3 } from 'three'
import { Sphere } from '@react-three/drei'
import { Glasshopper } from 'glib'

type PointProps = {
  point: Glasshopper.Geometry.Point
  selected: boolean
}

export const PointGeometry = ({ point, selected }: PointProps): React.ReactElement => {
  const { x, y, z } = point

  return (
    <Sphere position={[x, z, -y]} scale={new Vector3(0.1, 0.1, 0.1)}>
      <meshBasicMaterial attach="material" color={selected ? 'green' : 'darkred'} opacity={0.6} transparent={true} />
    </Sphere>
  )
}
