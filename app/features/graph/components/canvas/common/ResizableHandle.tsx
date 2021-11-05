import React from 'react'
import { useResizableElement, ResizeAnchor } from './ResizableElementContainer'

type ResizableHandleProps = {
  anchor: ResizeAnchor
  children?: JSX.Element
}

export const ResizableHandle = ({ anchor, children }: ResizableHandleProps): React.ReactElement => {
  const { onResizeStart } = useResizableElement()

  return (
    <div
      className="w-full h-full no-drag"
      onPointerDown={(e) => {
        if (e.pointerType !== 'mouse') {
          return
        }

        onResizeStart(e, anchor)
      }}
    >
      {children}
    </div>
  )
}
