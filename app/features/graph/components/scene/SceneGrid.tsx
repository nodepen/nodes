import React from 'react'
import { LineGeometry, PointGeometry } from './components/geometry'

export const SceneGrid = (): React.ReactElement => {
  const spacing = 1
  const size = 100
  const s = size / 2

  const major = 10
  const minor = 100
  const n = minor / 2

  const step = size / minor

  return (
    <>
      {new Array(n * 2 + 1).fill('').map((_, it) => {
        const i = (it - n) * step
        const j = s

        return (
          <>
            <LineGeometry
              line={{ from: { x: i, y: -j, z: 0 }, to: { x: i, y: j, z: 0 } }}
              material={{ color: '#7BBFA5', width: i % major === 0 ? 0.15 : 0.05, opacity: 0.5 }}
            />
            <LineGeometry
              line={{ from: { x: -j, y: i, z: 0 }, to: { x: j, y: i, z: 0 } }}
              material={{ color: '#7BBFA5', width: i % major === 0 ? 0.15 : 0.05, opacity: 0.5 }}
            />
          </>
        )
      })}
      <LineGeometry
        line={{ from: { x: 0, y: 0, z: 0 }, to: { x: 1, y: 0, z: 0 } }}
        material={{ color: '#333', width: 0.1 }}
      />
      <LineGeometry
        line={{ from: { x: 0, y: 0, z: 0 }, to: { x: 0, y: 1, z: 0 } }}
        material={{ color: '#333', width: 0.1 }}
      />
      <LineGeometry
        line={{ from: { x: 0, y: 0, z: 0 }, to: { x: 0, y: 0, z: 1 } }}
        material={{ color: '#333', width: 0.1 }}
      />
    </>
  )
}
