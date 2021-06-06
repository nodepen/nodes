import React, { useRef, useState } from 'react'
import { assert } from 'glib'

import { useOutsideClick } from 'hooks'
import { useGraphDispatch, useGraphElements } from 'features/graph/store/graph/hooks'
import { useCameraStaticZoom, useCameraStaticPosition } from 'features/graph/store/camera/hooks'
import { useParameterMenuSource, useOverlayDispatch } from 'features/graph/store/overlay/hooks'

import { isInputOrOutput } from 'features/graph/utils'
import { ParameterIcon } from '../../icons'
import { useSetCameraPosition } from '@/features/graph/hooks'

import { ParameterConnectionMenu } from './submenus'

const ParameterMenu = (): React.ReactElement => {
  const { setMode } = useGraphDispatch()
  const elements = useGraphElements()
  const { elementId: sourceElementId, parameterId: sourceParameterId } = useParameterMenuSource()
  const { clear, setParameterMenuConnection } = useOverlayDispatch()

  const menuRef = useRef<HTMLDivElement>(null)

  const [openMenu, setOpenMenu] = useState<'home' | 'data' | 'connection'>('home')

  const handleOutsideClick = (): void => {
    if (openMenu !== 'home') {
      console.log('doing nothing!')
      return
    }
    console.log('clear!')
    clear()
  }

  useOutsideClick(menuRef, handleOutsideClick)

  const setCameraPosition = useSetCameraPosition()

  const element = elements[sourceElementId]

  if (!assert.element.isStaticComponent(element)) {
    return <></>
  }

  const elementState = element.current

  if (!assert.element.isGraphElement(elementState)) {
    return <></>
  }

  const parameterMode = isInputOrOutput(element, sourceParameterId) === 'input' ? 'inputs' : 'outputs'

  const parameter = element.template[parameterMode][element.current[parameterMode][sourceParameterId]]

  const { name, nickname, type, description } = parameter

  const handleClose = (): void => {
    setOpenMenu('home')

    const [x, y] = element.current.position
    const [dx, dy] = element.current.anchors[sourceParameterId]

    setMode('idle')
    setCameraPosition(x + dx, y + dy, parameterMode === 'inputs' ? 'TR' : 'TL', 45)
  }

  return (
    <div className="w-full h-full relative">
      <div
        className="absolute w-vw left-0 top-0 z-10 transition-all duration-150"
        style={{ transform: openMenu === 'connection' ? 'translateX(0)' : 'translateX(100vw)' }}
      >
        <ParameterConnectionMenu onClose={handleClose} />
      </div>
      <div
        ref={menuRef}
        className={`${
          parameterMode === 'inputs' ? 'p-2 pr-14' : 'p-2 pl-14'
        } w-full flex flex-col transition-all duration-150`}
        style={{ transform: openMenu === 'home' ? 'translateX(0)' : 'translateX(-100vw)' }}
      >
        <div className="w-full mb-2 p-2 border-2 border-dark rounded-md bg-white pointer-events-auto">
          <div className="w-full mb-1 flex justify-start items-center overflow-x-hidden">
            <div className="w-12 h-12 mr-2 flex flex-col justify-center items-center">
              <ParameterIcon type={type} size="md" />
            </div>
            <div className="flex-grow flex flex-col justify-center font-sans">
              <div className="flex flew-row items-center whitespace-nowrap">
                <p className="mr-2 font-semibold">{name}</p>
                <p>({nickname})</p>
              </div>
              <div className="flex flew-row items-center whitespace-nowrap text-xs">
                <p className="font-medium">{type}&nbsp;</p>
                <p>{`${parameterMode === 'inputs' ? 'for' : 'from'}`}</p>
                <img
                  width="18"
                  height="18"
                  className="ml-2 mr-1"
                  src={`data:image/png;base64,${element.template.icon}`}
                  alt={`Component icon for the ${element.template.name} component.`}
                ></img>
                <p>{element.template.name}</p>
              </div>
            </div>
          </div>
          <div className="w-full pl-14">{description}</div>
        </div>
        <button className="w-full mb-2 p-2 flex justify-start items-center border-2 border-dark rounded-md bg-white pointer-events-auto">
          <div className="w-12 h-8 mr-2 flex flex-col justify-center items-center">
            <svg className="w-6 h-6" fill="none" stroke="#333" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div className="flex-grow flex items-center justify-between">
            <p className="text-sm font-medium font-sans">View data</p>
            <svg className="w-4 h-4" fill="none" stroke="#333" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
        <button
          onClick={() => {
            setMode('connecting')
            setOpenMenu('connection')

            setParameterMenuConnection({
              sourceType: parameterMode === 'inputs' ? 'input' : 'output',
              from:
                parameterMode === 'inputs' ? undefined : { elementId: sourceElementId, parameterId: sourceParameterId },
              to:
                parameterMode === 'inputs' ? { elementId: sourceElementId, parameterId: sourceParameterId } : undefined,
            })
          }}
          className="w-full mb-2 p-2 flex justify-start items-center border-2 border-dark rounded-md bg-white pointer-events-auto"
        >
          <div className="w-12 h-8 mr-2 flex flex-col justify-center items-center">
            <svg className="w-6 h-6" fill="none" stroke="#333" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <line
                x1="6"
                y1="18"
                x2="18"
                y2="6"
                fill="none"
                stroke="#333"
                strokeWidth="2px"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx="6"
                cy="18"
                r="2"
                fill="#FFF"
                stroke="#333"
                strokeWidth="2px"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx="18"
                cy="6"
                r="2"
                fill="#FFF"
                stroke="#333"
                strokeWidth="2px"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div className="flex-grow flex items-center justify-between">
            <p className="text-sm font-medium font-sans">Connect to</p>
            <svg className="w-4 h-4" fill="none" stroke="#333" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}

export default React.memo(ParameterMenu)
