import React from 'react'
import { useCamera, useGridScale } from '../store/hooks'

const GraphGrid = (): React.ReactElement => {
  const {
    position: [cx, cy],
    zoom,
  } = useCamera()

  const scale = useGridScale()

  return (
    <div
      className={`w-full h-full bg-pale z-0 overflow-hidden relative transition-opacity duration-75`}
      style={{
        backgroundSize: `${25 * zoom * scale}px ${25 * zoom * scale}px`,
        backgroundPosition: `${cx % (25 * zoom * scale)}px ${cy % (25 * zoom * scale)}px`,
        backgroundImage: `linear-gradient(to right, #98e2c6 ${
          0.3 * zoom
        }mm, transparent 1px, transparent 10px), linear-gradient(to bottom, #98e2c6 ${
          0.3 * zoom
        }mm, transparent 1px, transparent 10px)`,
      }}
    ></div>
  )
}

export default React.memo(GraphGrid)
