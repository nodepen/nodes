import React from 'react'
import { NodePen } from 'glib'
import { PanelGrip, PanelUserInput } from './components'
import { ElementContainer, ResizableElementContainer, ResizableHandle, useResizableElement } from '../../common'
import { useDebugRender } from '@/hooks'
import { useCameraZoomLevel } from '@/features/graph/store/camera/hooks'
import { usePanelValues } from './hooks'
import { getDataTreePathString } from '@/features/graph/utils'
import { useGraphSelection } from '@/features/graph/store/graph/hooks'

type PanelProps = {
  element: NodePen.Element<'panel'>
}

const Panel = ({ element }: PanelProps): React.ReactElement => {
  const { id } = element

  useDebugRender(`Panel | ${id}`)

  const { source, values } = usePanelValues(element)

  const zoomLevel = useCameraZoomLevel()

  const { transform, dimensions } = useResizableElement()

  const [tx, ty] = transform
  const { width, height } = dimensions

  const selection = useGraphSelection()
  const isSelected = selection.includes(id)

  const value = values

  return (
    <div
      className={`${zoomLevel === 'far' ? '' : 'shadow-osm'} ${
        isSelected ? 'bg-green' : 'bg-white'
      } flex flex-col justify-start items-center rounded-md overflow-visible`}
      style={{ transform: `translate(${tx}px, ${ty}px)`, width, height }}
    >
      <div className="w-full h-full panel-container">
        <div className="w-full h-full panel-body overflow-hidden">
          {source === 'self' && zoomLevel !== 'far' ? (
            <div className="w-full h-full overflow-hidden">
              <PanelUserInput
                elementId={id}
                initialValue={(values?.[getDataTreePathString([0])]?.[0]?.value as string) ?? ''}
              />
            </div>
          ) : null}
          {source === 'solution' ? (
            <div className="w-full h-full rounded-sm bg-green">{JSON.stringify(values)}</div>
          ) : null}
        </div>
        <div className="w-full h-full flex flex-col" style={{ gridArea: 'edge-l' }}>
          <div className="w-full flex-grow border-l-2 border-dark hover:cursor-ew">
            <ResizableHandle anchor="L" />
          </div>
          <div className="w-full h-8 flex flex-col justify-center items-center border-l-2 border-dark">
            <PanelGrip elementId={id} mode="input" />
          </div>
          <div className="w-full flex-grow border-l-2 border-dark hover:cursor-ew">
            <ResizableHandle anchor="L" />
          </div>
        </div>
        <div className="w-full h-full flex flex-col" style={{ gridArea: 'edge-r' }}>
          <div className="w-full flex-grow border-r-2 border-dark hover:cursor-ew">
            <ResizableHandle anchor="R" />
          </div>
          <div className="w-full h-8 flex flex-col justify-center items-center border-r-2 border-dark">
            <PanelGrip elementId={id} mode="output" />
          </div>
          <div className="w-full flex-grow border-r-2 border-dark hover:cursor-ew">
            <ResizableHandle anchor="R" />
          </div>
        </div>
        <div className="w-full h-full" style={{ gridArea: 'edge-t' }}>
          <ResizableHandle anchor="T">
            <div className="w-full h-full border-t-2 border-dark hover:cursor-ns" />
          </ResizableHandle>
        </div>
        <div className="w-full h-full" style={{ gridArea: 'edge-b' }}>
          <ResizableHandle anchor="B">
            <div className="w-full h-full border-b-2 border-dark hover:cursor-ns" />
          </ResizableHandle>
        </div>
        <div className="w-full h-full" style={{ gridArea: 'corner-tl' }}>
          <ResizableHandle anchor="TL">
            <div className="w-full h-full rounded-tl-md border-t-2 border-l-2 border-dark hover:cursor-nwse" />
          </ResizableHandle>
        </div>
        <div className="w-full h-full" style={{ gridArea: 'corner-bl' }}>
          <ResizableHandle anchor="BL">
            <div className="w-full h-full rounded-bl-md border-b-2 border-l-2 border-dark hover:cursor-nesw" />
          </ResizableHandle>
        </div>
        <div className="w-full h-full" style={{ gridArea: 'corner-br' }}>
          <ResizableHandle anchor="BR">
            <div className="w-full h-full rounded-br-md border-b-2 border-r-2 border-dark hover:cursor-nwse" />
          </ResizableHandle>
        </div>
        <div className="w-full h-full" style={{ gridArea: 'corner-tr' }}>
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
          grid-template-areas:
            'corner-tl  edge-t      corner-tr'
            'edge-l     panel-body  edge-r'
            'corner-bl  edge-b      corner-br';
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
        <ResizableElementContainer element={element} elementAnchors={{ L: ['input'], R: ['output'] }}>
          <Panel element={element} />
        </ResizableElementContainer>
      </ElementContainer>
    </>
  )
}

export default React.memo(PanelContainer)
