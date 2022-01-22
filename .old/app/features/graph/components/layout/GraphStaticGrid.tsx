import React from 'react'
import { useCameraZoomLevel } from '../../store/camera/hooks'

const GraphStaticGrid = (): React.ReactElement => {
  const zoomLevel = useCameraZoomLevel()

  const size = zoomLevel === 'far' ? 50 : 10
  const thickness = zoomLevel === 'far' ? 1 : 0.3

  return (
    <div className="w-full h-full relative overflow-visible">
      <div
        className="absolute bg-pale"
        style={{
          left: -125,
          top: -125,
          width: 5000,
          height: 5000,
          backgroundSize: `${size}mm ${size}mm`,
          backgroundImage: `linear-gradient(to right, #98e2c6 ${thickness}mm, transparent 1px, transparent 10px), linear-gradient(to bottom, #98e2c6 ${thickness}mm, transparent 1px, transparent 10px)`,
          WebkitOverflowScrolling: 'touch',
        }}
      />
    </div>
  )
}

export default React.memo(GraphStaticGrid)
