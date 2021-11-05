import React from 'react'

type GripIconProps = {
  mode: 'input' | 'output'
  shadow: boolean
}

/**
 * Returns svg for the standard grip, its 'shadow', and an invisible buffer target area.
 */
export const GripIcon = ({ mode, shadow }: GripIconProps): React.ReactElement => {
  // const tx = mode === 'input' ? 'translateX(-9px)' : 'translateX(9px)'

  const d = mode === 'input' ? 'M5,2 a1,1 0 0,0 0,8' : 'M5,10 a1,1 0 0,0 0,-8'

  const capture = mode === 'input' ? 'M5,-10 a1,1 0 0,0 0,30' : 'M5,20 a1,1 0 0,0 0,-30'

  return (
    <svg className="w-4 h-4 overflow-visible" viewBox="0 0 10 10">
      {shadow ? <path d={d} fill="#333" stroke="#333" strokeWidth="2px" vectorEffect="non-scaling-stroke" /> : null}
      <circle cx="5" cy="5" r="4" stroke="#333" strokeWidth="2px" vectorEffect="non-scaling-stroke" fill="#FFF" />
      <path d={capture} fill="#FFF" opacity="0" stroke="none" />
    </svg>
  )
}
