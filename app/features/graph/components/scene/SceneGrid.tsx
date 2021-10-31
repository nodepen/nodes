import React from 'react'
import { LineGeometry } from './components/geometry'

export const SceneGrid = (): React.ReactElement => {
  const spacing = 1
  const size = 100
  const s = size / 2

  const major = 10
  const minor = 100

  return (
    <>
      <LineGeometry line={{ from: { x: 0, y: -s, z: 0 }, to: { x: 0, y: s, z: 0 } }} material={{ color: 'green' }} />
      <LineGeometry line={{ from: { x: -s, y: 0, z: 0 }, to: { x: s, y: 0, z: 0 } }} material={{ color: 'green' }} />
    </>
  )
}
