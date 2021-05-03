import React from 'react'
import { Curve } from './lib/geometry'

export const SceneGrid = (): React.ReactElement => {
  const extents = 20
  const steps = Array.from('x'.repeat(extents * 2 + 1))

  return (
    <>
      {steps.map((x, i) => {
        return (
          <>
            <Curve
              curve={{ degree: 1, segments: [[i - extents, -extents, 0, 0, 0, 0, 0, 0, 0, i - extents, extents, 0]] }}
              material={{ width: 0.04, color: '#98E2C6' }}
            />
            <Curve
              curve={{ degree: 1, segments: [[-extents, i - extents, 0, 0, 0, 0, 0, 0, 0, extents, i - extents, 0]] }}
              material={{ width: 0.04, color: '#98E2C6' }}
            />
          </>
        )
      })}
    </>
  )
}
