import React from 'react'
import { NodePen } from 'glib'
import { ElementContainer, ResizableElementContainer, ResizableHandle, useResizableElement } from '../../common'
import { useDebugRender } from '@/hooks'
import { useCameraZoomLevel } from '@/features/graph/store/camera/hooks'

type PanelProps = {
  element: NodePen.Element<'panel'>
}

const Panel = ({ element }: PanelProps): React.ReactElement => {
  const { id } = element

  useDebugRender(`Panel | ${id}`)

  const zoomLevel = useCameraZoomLevel()

  const { transform, dimensions, onResizeStart } = useResizableElement()

  const [tx, ty] = transform
  const { width, height } = dimensions

  return (
    <div
      className={`${
        zoomLevel === 'far' ? '' : 'shadow-osm'
      } flex flex-col justify-start items-center bg-white rounded-md overflow-visible`}
      style={{ transform: `translate(${tx}px, ${ty}px)`, width, height }}
    >
      <div className="w-full h-full panel-container">
        <div className="w-full h-full corner-tl">
          <ResizableHandle anchor="TL">
            <div className="w-full h-full rounded-tl-md border-t-2 border-l-2 border-dark hover:cursor-nwse" />
          </ResizableHandle>
        </div>
        <div className="w-full h-full corner-bl">
          <ResizableHandle anchor="BL">
            <div className="w-full h-full rounded-bl-md border-b-2 border-l-2 border-dark hover:cursor-nesw" />
          </ResizableHandle>
        </div>
        <div className="w-full h-full corner-br">
          <ResizableHandle anchor="BR">
            <div className="w-full h-full rounded-br-md border-b-2 border-r-2 border-dark hover:cursor-nwse" />
          </ResizableHandle>
        </div>
        <div className="w-full h-full corner-tr">
          <ResizableHandle anchor="TR">
            <div className="w-full h-full rounded-tr-md border-t-2 border-r-2 border-dark hover:cursor-nesw" />
          </ResizableHandle>
        </div>
      </div>
      <style jsx>{`
        .panel-container {
          display: grid;
          grid-template-rows: 16px 1fr 16px;
          grid-template-columns: 16px 1fr 16px;
        }

        .corner-tl {
          grid-row: 1 / span 1;
          grid-column: 1 / span 1;
        }

        .corner-tr {
          grid-row: 1 / span 1;
          grid-column: 3 / span 1;
        }

        .corner-bl {
          grid-row: 3 / span 1;
          grid-column: 1 / span 1;
        }

        .corner-br {
          grid-row: 3 / span 1;
          grid-column: 3 / span 3;
        }
      `}</style>
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
