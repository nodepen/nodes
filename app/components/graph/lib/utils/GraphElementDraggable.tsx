import React, { useState, useEffect } from 'react'
import { Grasshopper } from 'glib'

type GraphElementDraggableProps = {
  start: [number, number]
  template: Grasshopper.Component
  onDrop: (position: [number, number], template: Grasshopper.Component) => void
  onCancel: () => void
}

export const GraphElementDraggable = ({
  start,
  template,
  onDrop,
  onCancel,
}: GraphElementDraggableProps): React.ReactElement => {
  const [[x, y], setPosition] = useState(start)

  const handlePointerMove = (e: PointerEvent): void => {
    const { pageX, pageY } = e
    setPosition([pageX, pageY])
  }

  const handlePointerUp = (e: PointerEvent): void => {
    const { pageX, pageY } = e
    onDrop([pageX, pageY], template)
  }

  const handleCancel = (): void => {
    onCancel()
  }

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointerleave', handleCancel)
    window.addEventListener('pointercancel', handleCancel)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointerleave', handleCancel)
      window.removeEventListener('pointercancel', handleCancel)
    }
  })

  return (
    <div className="w-8 h-8 bg-none border-2 border-darkgreen rounded-sm fixed" style={{ left: x - 16, top: y - 16 }} />
  )
}
