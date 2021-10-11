import React, { useState, useRef, useCallback } from 'react'
import { NodePen } from 'glib'
import { useDebugRender, useLongHover } from 'hooks'
import { ElementContainer } from '../../common'
import { useGraphSelection } from '@/features/graph/store/graph/hooks'
import { useCameraZoomLevel } from '@/features/graph/store/camera/hooks'
import { StaticComponentParameter } from './components'
import { HoverTooltip } from '../../../overlay'

type StaticComponentProps = {
  element: NodePen.Element<'static-component'>
}

const StaticComponent = ({ element }: StaticComponentProps): React.ReactElement => {
  const { template, id } = element

  useDebugRender(`StaticComponent | ${template.name} | ${id}`)

  const zoomLevel = useCameraZoomLevel()

  const selection = useGraphSelection()

  const isSelected = selection.includes(id)

  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipPosition = useRef<[number, number]>([0, 0])

  const handleLongHover = useCallback((e: PointerEvent): void => {
    const { pageX, pageY } = e

    tooltipPosition.current = [pageX, pageY]
    setShowTooltip(true)
  }, [])

  const longHoverTarget = useLongHover(handleLongHover)

  return (
    <>
      <ElementContainer element={element}>
        <div className="flex flex-col items-stretch pointer-events-auto">
          <div
            className={`${
              isSelected ? 'bg-green' : 'bg-white'
            } h-2 border-2 border-b-0 border-dark rounded-md rounded-bl-none rounded-br-none transition-colors duration-150`}
          />
          <div
            className={`${
              isSelected ? 'bg-green' : 'bg-white'
            } flex flex-row justify-center items-stretch transition-colors duration-150`}
          >
            <div className="flex-grow flex flex-col items-stretch">
              {Object.entries(element.current.inputs).map(([id, i]) => {
                const parameter = element.template.inputs[i]

                return (
                  <StaticComponentParameter
                    key={`input-param-${id}`}
                    mode={'input'}
                    template={parameter}
                    elementId={element.id}
                    parameterId={id}
                  />
                )
              })}
            </div>
            <div
              id="label-column"
              className={`w-10 ml-1 mr-1 p-2 pt-4 pb-4 rounded-md bg-white border-2 border-dark flex flex-col justify-center items-center transition-colors duration-150`}
              ref={longHoverTarget}
            >
              <div
                className={`${
                  zoomLevel === 'far' ? 'opacity-0' : 'opacity-100'
                } font-panel text-v font-bold text-sm select-none`}
                style={{ writingMode: 'vertical-lr', textOrientation: 'sideways', transform: 'rotate(180deg)' }}
              >
                {template.nickname.toUpperCase()}
              </div>
            </div>
            <div className="flex-grow flex flex-col items-stretch">
              {Object.entries(element.current.outputs).map(([id, i]) => {
                const parameter = element.template.outputs[i]

                return (
                  <StaticComponentParameter
                    key={`output-param-${id}`}
                    mode={'output'}
                    template={parameter}
                    elementId={element.id}
                    parameterId={id}
                  />
                )
              })}
            </div>
          </div>
          <div
            className={`${isSelected ? 'bg-green' : 'bg-white'} ${
              zoomLevel === 'far' ? '' : 'shadow-osm'
            } h-2 border-2 border-t-0 border-dark rounded-md rounded-tl-none rounded-tr-none transition-colors duration-150`}
          />
        </div>
      </ElementContainer>
      {showTooltip ? (
        <HoverTooltip position={tooltipPosition.current} onClose={() => setShowTooltip(false)}>
          <div className="w-12 h-12 bg-blue-500" />
        </HoverTooltip>
      ) : null}
    </>
  )
}

export default React.memo(StaticComponent)
