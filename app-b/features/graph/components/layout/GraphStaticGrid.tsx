import React from 'react'

const GraphStaticGrid = (): React.ReactElement => {
  const size = 10
  const thickness = 0.3

  return (
    <div className="w-full h-full relative overflow-visible">
      <div
        className="absolute bg-pale"
        style={{
          left: -45,
          top: -45,
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
