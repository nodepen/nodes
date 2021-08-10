import React, { useEffect, useRef, useState } from 'react'
import { NodePen } from 'glib'
import { useGraphDispatch, useGraphSelection } from 'features/graph/store/graph/hooks'
import { useCameraStaticZoom, useCameraMode, useCameraDispatch } from 'features/graph/store/camera/hooks'
import Draggable from 'react-draggable'
import { useElementDimensions, useCriteria, useDebugRender } from 'hooks'
import { StaticComponentParameter } from './lib'
import { useComponentMenuActions } from './lib/hooks'
import { GenericMenu } from 'features/graph/components/overlay'
import { useClickSelection } from 'features/graph/hooks'

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

  const selection = useGraphSelection()
  const isSelected = selection.includes(id)
  // const isSelected = true

  useEffect(() => {
    if (isMoved.current || !width || !height) {
      return
    }
    isMoved.current = true

    registerElement({ id, dimensions: [width, height], adjustment: [width / -2, height / -2] })
  }, [width, height])

  const pointerDownStartTime = useRef<number>(Date.now())
  const pointerDownStartPosition = useRef<[number, number]>([0, 0])

  const componentMenuActions = useComponentMenuActions(element)
  const [showComponentMenuOverlay, setShowComponentMenuOverlay] = useState(false)
  const [overlayPosition, setOverlayPosition] = useState<[number, number]>([0, 0])

  const handleClick = useClickSelection(id)

  return (
    <div className="w-full h-full pointer-events-none absolute left-0 top-0 z-30">
      <div className="w-min h-full relative">
        <Draggable
          scale={scale}
          position={{ x, y }}
          onMouseDown={(e) => {
            e.stopPropagation()
          }}
          onStart={(e) => {
            e.stopPropagation()
            setZoomLock(true)
            prepareLiveMotion({ anchor: id, targets: [id] })
          }}
          onDrag={(_, d) => {
            const { deltaX, deltaY } = d
            dispatchLiveMotion(deltaX, deltaY)
          }}
          onStop={(_, e) => {
            const { x, y } = e
            moveElement(element.id, [x, y])
            setZoomLock(false)
            prepareLiveMotion({ anchor: 'selection', targets: selection })
          }}
          disabled={mode !== 'idle'}
        >
          <div
            className={`${isVisible ? 'opacity-100' : 'opacity-0'} flex flex-col items-stretch pointer-events-auto`}
            ref={componentRef}
            onPointerDown={(e) => {
              e.stopPropagation()
              pointerDownStartTime.current = Date.now()
            }}
            onPointerUp={(e) => {
              const duration = Date.now() - pointerDownStartTime.current

              if (e.button === 0 && duration < 150) {
                handleClick()
              }
            }}
          >
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
                      template={{ id, ...parameter }}
                      parent={element}
                    />
                  )
                })}
              </div>
              <div
                id="label-column"
                className={`${
                  showComponentMenuOverlay ? 'bg-green' : 'bg-white'
                } w-10 ml-1 mr-1 p-2 pt-4 pb-4 rounded-md border-2 border-dark flex flex-col justify-center items-center transition-colors duration-150`}
                onPointerDown={(e) => {
                  pointerDownStartTime.current = Date.now()

                  const { pageX, pageY } = e
                  pointerDownStartPosition.current = [pageX, pageY]
                }}
                onPointerUp={(e) => {
                  switch (e.pointerType) {
                    case 'mouse': {
                      if (e.button !== 2) {
                        return
                      }

                      const pointerDuration = Date.now() - pointerDownStartTime.current

                      if (pointerDuration > 300 || showComponentMenuOverlay) {
                        return
                      }

                      const { pageX, pageY } = e

                      setShowComponentMenuOverlay(true)
                      setOverlayPosition([pageX, pageY])

                      break
                    }
                    case 'touch': {
                      break
                    }
                  }
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
            <div
              className={`${
                isSelected ? 'bg-green' : 'bg-white'
              } h-2 border-2 border-t-0 border-dark rounded-md rounded-tl-none rounded-tr-none shadow-osm transition-colors duration-150`}
            />
          </div>
        </Draggable>
      </div>
      {showComponentMenuOverlay ? (
        <GenericMenu
          context={element}
          actions={componentMenuActions}
          position={overlayPosition}
          onClose={() => setShowComponentMenuOverlay(false)}
        />
      ) : null}
      <style jsx>{`
        @keyframes activemenutarget {
          from {
            background: #98e2c6;
          }
          to {
            background: #fff;
          }
        }

        .menu-target {
          animation-name: activemenutarget;
          animation-duration: 900ms;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
      `}</style>
    </div>
  )
}

export default React.memo(StaticComponent)
