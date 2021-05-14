import React, { useMemo } from 'react'
import { Curve } from './lib/geometry'

export const SceneGrid = (): React.ReactElement => {
  const extents = 20
  const steps = Array.from('x'.repeat(extents * 2 + 1))

  const grid = useMemo(
    () => (
      <>
        {steps.map((x, i) => {
          return (
            <>
              <Curve
                curve={{ degree: 1, segments: [[i - extents, -extents, 0, 0, 0, 0, 0, 0, 0, i - extents, extents, 0]] }}
                material={{ size: 0.04, color: '#98E2C6', opacity: 1 }}
                key={`grid-a-${i}`}
              />
              <Curve
                curve={{ degree: 1, segments: [[-extents, i - extents, 0, 0, 0, 0, 0, 0, 0, extents, i - extents, 0]] }}
                material={{ size: 0.04, color: '#98E2C6', opacity: 1 }}
                key={`grid-b-${i}`}
              />
            </>
          )
        })}
      </>
    ),
    []
  )

  return grid
}
