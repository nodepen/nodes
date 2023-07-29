import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { COLORS } from '@/constants'

type ProgressBarProps = {
  /** A value between 0 & 1 */
  progress: number
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  const [progressBarDimensions, setProgressBarDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })

  const containerRef = useRef<HTMLDivElement>(null)

  const getContainerDimensions = () => {
    const element = containerRef.current

    if (!element) {
      return
    }

    const { width, height } = element.getBoundingClientRect()

    return { width, height }
  }

  useLayoutEffect(() => {
    const containerDimensions = getContainerDimensions() ?? { width: 0, height: 0 }

    console.log({ containerDimensions })

    const { width, height } = containerDimensions

    setProgressBarDimensions({ width: width - 2, height: height - 2 })
  }, [])

  const { width, height } = progressBarDimensions

  return (
    <div
      className="np-w-full np-h-full np-flex np-items-center np-justify-center np-overflow-visible"
      ref={containerRef}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="np-overflow-visible"
      >
        <rect
          x={0}
          y={0}
          rx={2}
          ry={2}
          width={width}
          height={height}
          stroke={COLORS.DARK}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
      </svg>
    </div>
  )
}
