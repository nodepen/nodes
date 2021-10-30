import React from 'react'
import { NodePen } from 'glib'
import { ElementContainer, ResizableElementContainer, useResizableElement } from '../../common'
import { useDebugRender } from '@/hooks'

type PanelProps = {
  element: NodePen.Element<'panel'>
}

const Panel = ({ element }: PanelProps): React.ReactElement => {
  const { id, current } = element

  useDebugRender(`Panel | ${id}`)

  const { transform, dimensions, onResizeStart } = useResizableElement()

  const [tx, ty] = transform
  const { width, height } = dimensions

  return (
    <div
      className="bg-white rounded-md flex flex-col justify-end items-center"
      style={{ transform: `translate(${tx}px, ${ty}px)`, width, height }}
    >
      <div className="w-full h-8 flex justify-start items-center">
        <div
          className="w-8 h-8 bg-red-500 no-drag"
          onPointerDown={(e) => {
            onResizeStart(e, 'BL')
          }}
        />
      </div>
    </div>
  )
}

const PanelContainer = ({ element }: PanelProps): React.ReactElement => {
  const { id } = element

  return (
    <>
      <ElementContainer element={element}>
        <ResizableElementContainer elementId={id}>
          <Panel element={element} />
        </ResizableElementContainer>
      </ElementContainer>
    </>
  )
}

export default React.memo(PanelContainer)
