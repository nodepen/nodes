import React, { useState, useRef, useLayoutEffect } from 'react'
import { COLORS } from '@/constants'
import { getRoundedRectangleDash } from '@/utils/geometry'
import { useReducedMotion } from '@/hooks'
import { clamp } from '@/utils/numerics'

type ProgressBarProps = {
  /** A value between 0 & 1 */
  progress: number
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  const prefersReducedMotion = useReducedMotion()

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

    const { width, height } = containerDimensions

    setProgressBarDimensions({ width: width - 2, height: height - 2 })
  }, [])

  const { width, height } = progressBarDimensions

  // Fill cheats a little at the beginning and the end to maintain legibility.
  const getProgressBarFill = () => {
    const minimumProgressWidth = 6
    const maximumProgressWidth = width - 8

    if (progress === 1) {
      return width + 4
    }

    return clamp(width * progress, minimumProgressWidth, maximumProgressWidth)
  }

  const { strokeDasharray, strokeDashoffset } = getRoundedRectangleDash(4, 4, width, height, 2)

  const fillWidth = getProgressBarFill()

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
        <defs>
          <clipPath id="fill-clip">
            <rect
              x={-width + fillWidth - 8}
              y={-4}
              width={width + 8 - 1}
              height={height + 8}
              style={{ transition: 'x', transitionDuration: '300ms', transitionTimingFunction: 'ease-out' }}
            />
          </clipPath>
          <clipPath id="dash-clip">
            <rect
              x={fillWidth + 1}
              y={-4}
              width={width + 8}
              height={height + 8}
              style={{ transition: 'x', transitionDuration: '300ms', transitionTimingFunction: 'ease-out' }}
            />
          </clipPath>
        </defs>
        <rect
          className={prefersReducedMotion ? '' : 'np-animate-march'}
          clipPath="url(#dash-clip)"
          x={0}
          y={0}
          rx={2}
          ry={2}
          width={width}
          height={height}
          stroke={COLORS.DARK}
          fill="none"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
        <rect
          clipPath="url(#fill-clip)"
          x={0}
          y={0}
          rx={2}
          ry={2}
          width={width}
          height={height}
          stroke={COLORS.DARK}
          fill={COLORS.GREEN}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
        {/* <line
          x1={0}
          y1={-4}
          x2={0}
          y2={height + 4}
          stroke={COLORS.LIGHT}
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          style={{
            transform: `translateX(${fillWidth}px)`,
            transition: 'transform',
            transitionDuration: '300ms',
            transitionTimingFunction: 'ease-out',
          }}
        /> */}
      </svg>
    </div>
  )
}
