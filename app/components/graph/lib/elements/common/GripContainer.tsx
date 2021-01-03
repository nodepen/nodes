import React, { useRef, useEffect } from 'react'
import { useGraphManager } from '@/context/graph'

type GripContainerProps = {
  source: {
    element: string
    parameter: string
  } // 'Which set of values does this grip point to?
}

export const GripContainer = ({ source }: GripContainerProps): React.ReactElement => {
  const { dispatch } = useGraphManager()

  // Parameter will be 'input' or 'output' on parameter-only elements
  const { element, parameter } = source

  const gripRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!gripRef.current) {
      return
    }

    const { width, height, left, top } = gripRef.current.getBoundingClientRect()

    const [cx, cy] = [left + (width / 2), top + (height / 2)]

    dispatch({ type: 'graph/register-element-anchor', elementId: element, anchorKey: parameter, position: [cx, cy] })
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>): void => {

  }

  return (
    <button
      ref={gripRef}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={handlePointerDown}
      className="w-4 h-4 rounded-full border-2 border-dark bg-white hover:bg-green shadow-osm"
    />
  )
}