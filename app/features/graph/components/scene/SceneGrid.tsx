import React from 'react'
import { LineGeometry, PointGeometry } from './components/geometry'

export const SceneGrid = (): React.ReactElement => {
  const spacing = 1
  const size = 100
  const s = size / 2

  const major = 10
  const minor = 100

  const step = size / minor

  // '#98E2C6'

  return (
    <>
      <LineGeometry
        line={{ from: { x: 0, y: -s, z: 0 }, to: { x: 0, y: s, z: 0 } }}
        material={{ color: '#98E2C6', width: 0.25 }}
      />
      <LineGeometry line={{ from: { x: -s, y: 0, z: 0 }, to: { x: s, y: 0, z: 0 } }} material={{ color: '#98E2C6' }} />
      <PointGeometry point={{ x: 0, y: 0, z: 0 }} />
    </>
  )
}
