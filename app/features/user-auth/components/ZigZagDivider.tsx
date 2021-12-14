import React from 'react'

/**
 * because it's cute
 */
export const ZigZagDivider = (): React.ReactElement => {
  return (
    <>
      {Array(7)
        .fill('')
        .map((_, i) => (
          <svg key={`title-underline-${i}`} width="25" height="25" viewBox="0 -2.5 10 10" className="overflow-visible">
            <polyline
              points="0,2.5 2.5,1 5,2.5 7.5,4 10,2.5"
              fill="none"
              stroke="#98E2C6"
              strokeWidth="3px"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ))}
    </>
  )
}
