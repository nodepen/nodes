import { NodePen } from 'glib'
import { useCameraStaticZoom, useCameraMode, useGraphDispatch } from '../../../store/hooks'
import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { useElementDimensions, useCriteria } from 'hooks'

type StaticComponentProps = {
  element: NodePen.Element<'static-component'>
}

const StaticComponent = ({ element }: StaticComponentProps): React.ReactElement | null => {
  const { template, current, id } = element
  console.log(`Render in ${element.id} !`)

  const [x, y] = current.position

  const scale = useCameraStaticZoom()
  const mode = useCameraMode()

  const { moveElement } = useGraphDispatch()

  const componentRef = useRef<HTMLDivElement>(null)

  const { width, height } = useElementDimensions(componentRef)

  const isVisible = useCriteria(width, height)

  useEffect(() => {
    if (!width || !height) {
      return
    }
    moveElement(id, [x - width / 2, y - height / 2])
  }, [width, height])

  return (
    <div className="w-full h-full pointer-events-none absolute left-0 top-0">
      <Draggable
        scale={scale}
        position={{ x, y }}
        onStart={(e) => {
          e.stopPropagation()
        }}
        onStop={(_, e) => {
          const { x, y } = e
          moveElement(element.id, [x, y])
          console.log({ x, y })
        }}
        disabled={scale < 0.5 || mode !== 'idle'}
      >
        <div
          className={`${isVisible ? 'opacity-100' : 'opacity-0'} w-6 h-6 bg-red-500 pointer-events-auto`}
          style={{ transform: `translate(${(width ?? 0) / -2}px, ${(height ?? 0) / -2}px)` }}
          ref={componentRef}
        >
          {template?.name ?? id}
        </div>
      </Draggable>
    </div>
  )
}

export default React.memo(StaticComponent)
