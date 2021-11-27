import React from 'react'

type QuirkyDividerProps = {
  topColor: string
  bottomColor: string
  animate?: boolean
}

export const QuirkyDivider = ({ topColor, bottomColor, animate }: QuirkyDividerProps): React.ReactElement => {
  return (
    <div className="w-full h-10 overflow-hidden" style={{ transform: 'translateY(20px)' }}>
      <div className="w-full h-4 z-20">
        <div
          className="w-8 h-8 ml-2 inline-block rounded-md"
          style={{ backgroundColor: topColor, transform: 'scaleY(0.5) rotate(45deg)' }}
        />
        <div
          className="w-8 h-8 ml-2 inline-block rounded-md"
          style={{ backgroundColor: topColor, transform: 'scaleY(0.5) rotate(45deg)' }}
        />
      </div>
      <div className="w-full h-4 z-10" style={{ transform: 'translate(20px, -4px)' }}>
        <div
          className="w-8 h-8 ml-2 inline-block rounded-md"
          style={{ backgroundColor: bottomColor, transform: 'scaleY(0.5) rotate(45deg)' }}
        />
        <div
          className="w-8 h-8 ml-2 inline-block rounded-md"
          style={{ backgroundColor: bottomColor, transform: 'scaleY(0.5) rotate(45deg)' }}
        />
      </div>
    </div>
  )
}
