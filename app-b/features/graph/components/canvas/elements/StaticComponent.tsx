import { NodePen } from 'glib'
import { useCameraStaticZoom, useCameraMode, useGraphDispatch, useCameraDispatch } from '../../../store/hooks'
import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { useElementDimensions, useCriteria, useDebugRender } from 'hooks'
import { useSetCameraPosition } from '@/features/graph/hooks/useSetCameraPosition'

type StaticComponentProps = {
  element: NodePen.Element<'static-component'>
}

const StaticComponent = ({ element }: StaticComponentProps): React.ReactElement | null => {
  const { template, current, id } = element

  useDebugRender(`StaticComponent ${template.name} ${id}`)

  const [x, y] = current.position

  const scale = useCameraStaticZoom()
  const mode = useCameraMode()

  const { moveElement } = useGraphDispatch()
  const { setZoomLock } = useCameraDispatch()

  const componentRef = useRef<HTMLDivElement>(null)

  const { width, height } = useElementDimensions(componentRef)

  const isMoved = useRef(false)
  const isVisible = useCriteria(width, height)

  useEffect(() => {
    if (isMoved.current || !width || !height) {
      return
    }
    isMoved.current = true
    moveElement(id, [x - width / 2, y - height / 2])
  }, [width, height])

  const [isMoving, setIsMoving] = useState(false)

  const showButtons = useCriteria(!isMoving, scale > 1.5)

  const setCameraPosition = useSetCameraPosition()

  return (
    <div className="w-full h-full pointer-events-none absolute left-0 top-0">
      <div className="w-min h-full relative">
        {/* {showButtons ? (
          <button
            className="w-6 h-6 bg-red-500 absolute top-0 pointer-events-auto"
            style={{ left: x - 36, top: y }}
            onPointerDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onClick={() => {
              setCameraPosition(-x, -y)
            }}
          />
        ) : null} */}
        <Draggable
          scale={scale}
          position={{ x, y }}
          onStart={(e) => {
            e.stopPropagation()
            setZoomLock(true)
            setIsMoving(true)
          }}
          onStop={(_, e) => {
            const { x, y } = e
            moveElement(element.id, [x, y])
            setZoomLock(false)
            setIsMoving(false)
          }}
          disabled={scale < 0.5 || mode !== 'idle'}
        >
          <div
            className={`${isVisible ? 'opacity-100' : 'opacity-0'} flex flex-col items-stretch pointer-events-auto`}
            ref={componentRef}
          >
            <div className="h-2 bg-white border-2 border-b-0 border-dark rounded-md rounded-bl-none rounded-br-none" />
            <div className="bg-white flex flex-row justify-center items-stretch">
              <div className="flex-grow flex flex-col items-stretch">
                {Object.entries(element.current.inputs).map(([id, i]) => {
                  const parameter = element.template.inputs[i]

                  return (
                    <div
                      key={`input-param-${id}`}
                      className={`flex-grow pt-2 pb-2 pr-4 flex flex-row justify-start items-center border-dark border-l-2 rounded-tr-md rounded-br-md transition-colors duration-75 hover:bg-dark`}
                    >
                      <svg
                        className="w-4 h-4 overflow-visible"
                        viewBox="0 0 10 10"
                        style={{ transform: 'translateX(-9px)' }}
                      >
                        <path
                          d="M5,2 a1,1 0 0,0 0,8"
                          fill="#333"
                          stroke="#333"
                          strokeWidth="2px"
                          vectorEffect="non-scaling-stroke"
                        />
                        <circle
                          cx="5"
                          cy="5"
                          r="4"
                          stroke="#333"
                          strokeWidth="2px"
                          vectorEffect="non-scaling-stroke"
                          fill="#FFF"
                        />
                      </svg>

                      <p>{parameter.nickname}</p>
                    </div>
                  )
                })}
              </div>
              <div className="ml-2 mr-2 flex flex-col justify-center items-center rounded-md border-2 border-dark">
                <p>OK</p>
              </div>
              <div className="flex-grow flex flex-col items-stretch">
                {Object.entries(element.current.outputs).map(([id, i]) => {
                  const parameter = element.template.outputs[i]

                  return (
                    <div
                      key={`output-param-${id}`}
                      className={`flex-grow pt-2 pb-2 pl-4 flex flex-row justify-start items-center border-dark border-r-2 rounded-tl-md rounded-bl-md transition-colors duration-75 hover:bg-gray-300`}
                    >
                      <p>{parameter.nickname}</p>
                      <svg
                        className="w-4 h-4 overflow-visible"
                        viewBox="0 0 10 10"
                        style={{ transform: 'translateX(9px)' }}
                      >
                        <path
                          d="M5,10 a1,1 0 0,0 0,-8"
                          fill="#333"
                          stroke="#333"
                          strokeWidth="2px"
                          vectorEffect="non-scaling-stroke"
                        />
                        <circle
                          cx="5"
                          cy="5"
                          r="4"
                          stroke="#333"
                          strokeWidth="2px"
                          vectorEffect="non-scaling-stroke"
                          fill="#FFF"
                        />
                      </svg>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="h-2 bg-white border-2 border-t-0 border-dark rounded-md rounded-tl-none rounded-tr-none shadow-osm" />
          </div>
        </Draggable>
      </div>
    </div>
  )
}

export default React.memo(StaticComponent)
