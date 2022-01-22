import React from 'react'

type GridDividerProps = {
  duration: number
}

export const GridDivider = ({ duration }: GridDividerProps): React.ReactElement => {
  return (
    <div className="w-full h-12 mb-8 overflow-hidden">
      <div className="grid" style={{ width: '300%', height: '100%' }} />
      <style jsx>{`
        @keyframes slide {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-33%);
          }
        }

        .grid {
          animation-name: slide;
          animation-duration: ${duration}s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          background-image: linear-gradient(to right, #98e2c6 2px, transparent 1px, transparent 10px),
            linear-gradient(to bottom, #98e2c6 2px, transparent 1px, transparent 10px);
          background-size: 5mm 5mm;
        }
      `}</style>
    </div>
  )
}
