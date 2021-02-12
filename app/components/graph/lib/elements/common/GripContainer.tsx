import React, { useRef, useEffect, useState } from 'react'
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

  const [isDrawingWire, setIsDrawingWire] = useState(false)

  const handlePointerMove = (e: PointerEvent): void => {
    const { pageX, pageY } = e

    dispatch({ type: 'graph/wire/update-live-wire', to: [pageX, pageY] })
  }

  const handlePointerUp = (): void => {
    dispatch({ type: 'graph/wire/stop-live-wire' })
    setIsDrawingWire(false)
  }

  const handlePointerEnter = (): void => {
    dispatch({ type: 'graph/wire/capture-live-wire', targetElement: source.element, targetParameter: source.parameter })
  }

  const handlePointerLeave = (): void => {
    dispatch({ type: 'graph/wire/release-live-wire', targetElement: source.element, targetParameter: source.parameter })
  }

  useEffect(() => {
    if (!isDrawingWire) {
      return
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    window.addEventListener('pointerleave', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('pointerleave', handlePointerUp)
    }
  })

  const gripRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!gripRef.current) {
      return
    }

    const { width, height, left, top } = gripRef.current.getBoundingClientRect()

    const [cx, cy] = [left + width / 2, top + height / 2]

    dispatch({ type: 'graph/register-element-anchor', elementId: element, anchorKey: parameter, position: [cx, cy] })
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>): void => {
    e.stopPropagation()

    const { width, height, left, top } = gripRef.current.getBoundingClientRect()
    const [cx, cy] = [left + width / 2, top + height / 2]

    const { pageX: tx, pageY: ty } = e

    dispatch({ type: 'graph/wire/start-live-wire', from: [cx, cy], to: [tx, ty], owner: source })
    setIsDrawingWire(true)
  }

  return (
    <button
      ref={gripRef}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="w-4 h-4 rounded-full border-2 border-dark bg-white hover:bg-green shadow-osm"
    />
  )
}
