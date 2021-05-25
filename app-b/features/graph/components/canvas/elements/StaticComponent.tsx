import { NodePen, assert } from 'glib'
import { useCameraZoom } from '../../../store/hooks'
import React from 'react'
import Draggable from 'react-draggable'

type StaticComponentProps = {
  element: NodePen.Element<'static-component'>
}

const StaticComponent = ({ element }: StaticComponentProps): React.ReactElement | null => {
  const scale = useCameraZoom()

  const [x, y] = element.current.position

  return (
    <Draggable
      scale={scale}
      position={{ x, y }}
      onStart={(e) => {
        e.stopPropagation()
      }}
      disabled={scale < 0.5}
    >
      <div className="w-6 h-6 bg-red-500">{element.id}</div>
    </Draggable>
  )
}

export default React.memo(StaticComponent)
