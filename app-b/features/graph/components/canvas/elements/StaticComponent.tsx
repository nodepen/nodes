import { NodePen } from 'glib'
import { useCameraZoom, useGraphDispatch } from '../../../store/hooks'
import React from 'react'
import Draggable from 'react-draggable'

type StaticComponentProps = {
  element: NodePen.Element<'static-component'>
}

const StaticComponent = ({ element }: StaticComponentProps): React.ReactElement | null => {
  const { template, current, id } = element

  const scale = useCameraZoom()

  const { moveElement } = useGraphDispatch()

  const [x, y] = current.position

  console.log(`Render in ${element.id} !`)

  return (
    <Draggable
      scale={scale}
      position={{ x, y }}
      onStart={(e) => {
        e.stopPropagation()
      }}
      onStop={(_, e) => {
        const { x, y } = e
        moveElement(element.id, [x, y])
      }}
      disabled={scale < 0.5}
    >
      <div className="w-6 h-6 bg-red-500">{template?.name ?? id}</div>
    </Draggable>
  )
}

export default React.memo(StaticComponent)
