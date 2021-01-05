import React, { useEffect, useRef } from 'react'
import { useGraphManager } from '@/context/graph'

type ParameterIconProps = {
  parent: string
}

export const ParameterIcon = ({ parent }: ParameterIconProps): React.ReactElement => {
  const { dispatch } = useGraphManager()

  const iconRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!iconRef.current) {
      return
    }

    const { width, height, left, top } = iconRef.current.getBoundingClientRect()

    const [cx, cy] = [left + width / 2, top + height / 2]

    dispatch({ type: 'graph/register-element-anchor', elementId: parent, anchorKey: 'input', position: [cx, cy] })
  }, [])

  const handlePointerEnter = (): void => {
    dispatch({ type: 'graph/wire/capture-live-wire', targetElement: parent, targetParameter: 'input' })
  }

  const handlePointerLeave = (): void => {
    dispatch({ type: 'graph/wire/release-live-wire', targetElement: parent, targetParameter: 'input' })
  }

  const f = Math.sqrt(3) / 2
  const points = `1,0 0.5,-${f} -0.5,-${f} -1,0 -0.5,${f} 0.5,${f}`

  return (
    <svg
      ref={iconRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      width="24px"
      height="24px"
      viewBox="-1 -1 2 2"
    >
      <defs>
        <clipPath id="annoying">
          <polygon points={points} />
        </clipPath>
      </defs>
      <polygon
        points={points}
        stroke="#333333"
        strokeWidth="4px"
        fill="#FFFFFF"
        vectorEffect="non-scaling-stroke"
        clipPath="url(#annoying)"
      />
    </svg>
  )
}
