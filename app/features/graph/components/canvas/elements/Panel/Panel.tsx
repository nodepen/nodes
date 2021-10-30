import React from 'react'
import { NodePen } from 'glib'
import { ElementContainer, ResizableElementContainer, useResizableElement } from '../../common'
import { useDebugRender } from '@/hooks'

type PanelProps = {
  element: NodePen.Element<'panel'>
}

const Panel = ({ element }: PanelProps): React.ReactElement => {
  const { id } = element

  useDebugRender(`Panel | ${id}`)

  const { transform, dimensions, ...dispatch } = useResizableElement()

  const [tx, ty] = transform
  const { width, height } = dimensions

  return (
    <div
      className="bg-white rounded-md flex justify-start items-center"
      style={{ transform: `translate(${tx}px, ${ty}px)`, width, height }}
    ></div>
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
