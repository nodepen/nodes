import React, { useState, useRef, useCallback } from 'react'
import { NodePen } from 'glib'
import { useDebugRender, useLongHover } from 'hooks'
import { ElementContainer, RuntimeMessageContainer, TooltipContainer } from '../../common'
import { useGraphSelection } from '@/features/graph/store/graph/hooks'
import { useCameraZoomLevel } from '@/features/graph/store/camera/hooks'
import { StaticComponentParameter } from './components'
import { StaticComponentDetails } from './details'
import { HoverTooltip } from '../../../overlay'
import { useElementStatusColor } from '../../hooks'

type StaticComponentProps = {
  element: NodePen.Element<'static-component'>
}

const StaticComponent = ({ element }: StaticComponentProps): React.ReactElement => {
  const { template, id } = element

  useDebugRender(`StaticComponent | ${template.name} | ${id}`)

  const statusColor = useElementStatusColor(element.id)

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

  const [isMoving, setIsMoving] = useState(false)

  return (
    <>
      <ElementContainer
        element={element}
        onStart={() => setIsMoving(true)}
        onStop={() => {
          setIsMoving(false)
          return { selection: false }
        }}
      >
        <div className="flex flex-col items-stretch pointer-events-auto">
          <div
            className={`${
              isSelected ? 'bg-green' : 'bg-white'
            } h-2 border-2 border-b-0 border-dark rounded-md rounded-bl-none rounded-br-none`}
          />
          <div className={`${isSelected ? 'bg-green' : 'bg-white'} flex flex-row justify-center items-stretch`}>
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
              className={`w-10 ml-1 mr-1 p-2 pt-4 pb-4 rounded-md border-2 border-dark flex flex-col justify-center items-center`}
              style={{ background: statusColor }}
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
            } h-2 border-2 border-t-0 border-dark rounded-md rounded-tl-none rounded-tr-none`}
          />
        </div>
      </ElementContainer>
      {showTooltip && !isMoving ? (
        <HoverTooltip position={tooltipPosition.current} onClose={() => setShowTooltip(false)}>
          <TooltipContainer>
            <StaticComponentDetails template={template} />
          </TooltipContainer>
        </HoverTooltip>
      ) : null}
      <RuntimeMessageContainer elementId={element.id} wait={isMoving} />
    </>
  )
}

export default React.memo(StaticComponent)
