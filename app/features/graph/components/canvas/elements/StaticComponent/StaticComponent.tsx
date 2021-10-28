import React, { useState, useRef, useCallback, useEffect } from 'react'
import { NodePen } from 'glib'
import { useDebugRender, useLongHover } from 'hooks'
import { ElementContainer, TooltipContainer } from '../../common'
import { useGraphSelection } from '@/features/graph/store/graph/hooks'
import { useCameraZoomLevel } from '@/features/graph/store/camera/hooks'
import { StaticComponentParameter } from './components'
import { StaticComponentDetails } from './details'
import { HoverTooltip } from '../../../overlay'
import { useElementStatusColor } from '../../hooks'
import { UnderlayPortal } from '../../../underlay'

type StaticComponentProps = {
  element: NodePen.Element<'static-component'>
}

const StaticComponent = ({ element }: StaticComponentProps): React.ReactElement => {
  const { template, id } = element

  const statusColor = useElementStatusColor(element.id)

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

  const [messages, setMessages] = useState<string>()

  useEffect(() => {
    if (statusColor !== '#FFFFFF') {
      setMessages('something')
    }
  }, [statusColor])

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
              className={`w-10 ml-1 mr-1 p-2 pt-4 pb-4 rounded-md border-2 border-dark flex flex-col justify-center items-center transition-colors duration-150`}
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
            } h-2 border-2 border-t-0 border-dark rounded-md rounded-tl-none rounded-tr-none transition-colors duration-150`}
          />
        </div>
      </ElementContainer>
      {showTooltip ? (
        <HoverTooltip position={tooltipPosition.current} onClose={() => setShowTooltip(false)}>
          <TooltipContainer>
            <StaticComponentDetails template={template} />
          </TooltipContainer>
        </HoverTooltip>
      ) : null}
      {messages ? (
        <UnderlayPortal parent={element.id} anchor="top">
          <div
            className="w-full h-128 flex flex-col justify-end items-center rounded-md overflow-visible"
            style={{ transform: `translateY(-${16 + 512}px)` }}
          >
            <div className="w-128 h-128 flex flex-col justify-end items-center">
              <div className="w-10 h-10 rounded-md bg-warn flex items-center justify-center z-10">
                <svg className="w-6 h-6" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {/* <div className="w-64 bg-warn rounded-md p-2 pl-4 pr-4 flex flex-col z-10">
                <h4 className="w-full h-8 flex justify-start items-center text-sm font-semibold">WARNING</h4>
                <p className="w-full h-8 text-md whitespace-nowrap overflow-hidden">Some detailed message goes here.</p>
              </div> */}
              <div
                className="w-8 h-8 rounded-md bg-warn z-0"
                style={{ transform: 'translateY(-20px) rotate(45deg) ' }}
              />
            </div>
          </div>
        </UnderlayPortal>
      ) : null}
    </>
  )
}

export default React.memo(StaticComponent)
