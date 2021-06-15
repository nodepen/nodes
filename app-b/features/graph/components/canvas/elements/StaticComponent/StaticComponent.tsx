import { NodePen } from 'glib'
import { useGraphDispatch } from 'features/graph/store/graph/hooks'
import { useCameraStaticZoom, useCameraMode, useCameraDispatch } from 'features/graph/store/camera/hooks'
import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { useElementDimensions, useCriteria, useDebugRender } from 'hooks'
import { StaticComponentParameter } from './lib'
import { OverlayPortal, OverlayContainer } from 'features/graph/components/overlay'

type StaticComponentProps = {
  element: NodePen.Element<'static-component'>
}

const StaticComponent = ({ element }: StaticComponentProps): React.ReactElement | null => {
  const { template, current, id } = element

  useDebugRender(`StaticComponent | ${template.name} | ${id}`)

  const [x, y] = current.position

  const scale = useCameraStaticZoom()
  const mode = useCameraMode()

  const { moveElement, registerElement, prepareLiveMotion, dispatchLiveMotion } = useGraphDispatch()
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
    registerElement({ id, dimensions: [width, height] })
  }, [width, height])

  // const [isMoving, setIsMoving] = useState(false)

  // const showButtons = useCriteria(!isMoving, scale > 1.5)

  // const setCameraPosition = useSetCameraPosition()

  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayPosition, setOverlayPosition] = useState<[number, number]>([0, 0])

  return (
    <div className="w-full h-full pointer-events-none absolute left-0 top-0 z-30">
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
          onMouseDown={() => {
            console.log({ mode })
          }}
          onStart={(e) => {
            console.log('draggable start!')
            e.stopPropagation()
            setZoomLock(true)
            prepareLiveMotion(id)
            // setIsMoving(true)
          }}
          onDrag={(_, d) => {
            const { deltaX, deltaY } = d
            dispatchLiveMotion(deltaX, deltaY)
          }}
          onStop={(_, e) => {
            const { x, y } = e
            moveElement(element.id, [x, y])
            setZoomLock(false)
            // setIsMoving(false)
          }}
          disabled={mode !== 'idle'}
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
                    <StaticComponentParameter
                      key={`input-param-${id}`}
                      mode={'input'}
                      template={{ id, ...parameter }}
                      parent={element}
                    />
                  )
                })}
              </div>
              <div
                id="label-column"
                className="w-10 ml-1 mr-1 p-2 pt-4 pb-4 rounded-md border-2 border-dark flex flex-col justify-center items-center transition-colors duration-150"
                onClick={(e) => {
                  const { pageX, pageY } = e

                  setShowOverlay((current) => !current)
                  setOverlayPosition([pageX, pageY])
                }}
              >
                <div
                  className="font-panel text-v font-bold text-sm select-none"
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
                      template={{ id, ...parameter }}
                      parent={element}
                    />
                  )
                })}
              </div>
            </div>
            <div className="h-2 bg-white border-2 border-t-0 border-dark rounded-md rounded-tl-none rounded-tr-none shadow-osm" />
          </div>
        </Draggable>
      </div>
      {showOverlay ? (
        <OverlayPortal>
          <OverlayContainer position={overlayPosition}>
            <div className="w-6 h-6 bg-red-400 absolute" style={{ left: 0, top: 0 }} />
          </OverlayContainer>
        </OverlayPortal>
      ) : null}
    </div>
  )
}

export default React.memo(StaticComponent)
