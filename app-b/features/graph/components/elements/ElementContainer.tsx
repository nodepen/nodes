import React from 'react'
import Draggable from 'react-draggable'
import { useCameraZoom } from '../../store/hooks'

const ElementContainer = (): React.ReactElement => {
  const scale = useCameraZoom()

  return (
    <Draggable
      scale={scale}
      onStart={(e) => {
        e.stopPropagation()
      }}
      disabled={scale < 0.5}
    >
      <div className="w-16 h-16 bg-red-500" />
    </Draggable>
  )
}

export default React.memo(ElementContainer)
