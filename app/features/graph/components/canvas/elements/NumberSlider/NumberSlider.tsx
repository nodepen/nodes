import React, { useEffect, useState } from 'react'
import { NodePen } from 'glib'
import Draggable from 'react-draggable'
import { UnderlayPortal } from '../../../underlay'
import { useDebugRender } from '@/hooks'
import { useCameraDispatch, useCameraStaticZoom } from '@/features/graph/store/camera/hooks'
import { useGraphDispatch } from '@/features/graph/store/graph/hooks'

type NumberSliderProps = {
  element: NodePen.Element<'number-slider'>
}

const INITIAL_WIDTH = 125

const NumberSlider = ({ element }: NumberSliderProps): React.ReactElement => {
  const { template, current, id } = element

  const { registerElement, updateElement } = useGraphDispatch()

  const { setZoomLock } = useCameraDispatch()
  const zoom = useCameraStaticZoom()

  const [width, setWidth] = useState(INITIAL_WIDTH)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    // Is this... is this okay?
    document.documentElement.style['cursor'] = isDragging ? 'ew-resize' : 'auto'
  }, [isDragging])

  useEffect(() => {
    if (isDragging) {
      return
    }

    // Capture undo case
    if (current.dimensions.width !== width) {
      setWidth(current.dimensions.width)
    }
  }, [isDragging, width, current.dimensions.width])

  useDebugRender(`NumberSlider | ${id}`)

  const [x, y] = current.position

  const [showUnderlay, setShowUnderlay] = useState(false)

  return (
    <>
      <div className="w-full h-full pointer-events-none absolute left-0 top-0 z-30">
        <div
          className="w-min h-full relative pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <Draggable position={{ x, y }} scale={zoom} disabled={isDragging}>
            <div
              className="h-8 p-2 bg-white flex items-center justify-start"
              onDoubleClick={() => {
                setShowUnderlay(true)
              }}
              style={{ width }}
            >
              <div className="h-full flex mr-2 p-1 pl-2 pr-2 items-center justify-center border-2 border-dark">
                Slider
              </div>
              {/* <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowUnderlay((current) => !current)
                }}
              >
                TRY IT
              </button> */}
              <Draggable
                axis="x"
                bounds={{ left: 0 }}
                position={{ x: width - INITIAL_WIDTH, y: 0 }}
                scale={zoom}
                onMouseDown={(e) => e.stopPropagation()}
                onStart={(e) => {
                  e.stopPropagation()
                  setShowUnderlay(false)
                  setZoomLock(true)
                  setIsDragging(true)
                }}
                onDrag={(e, d) => {
                  const { deltaX: dx } = d
                  const next = width + dx

                  setWidth(next < INITIAL_WIDTH ? INITIAL_WIDTH : next)
                }}
                onStop={() => {
                  setZoomLock(false)
                  setIsDragging(false)
                  updateElement({
                    id,
                    type: 'number-slider',
                    data: {
                      dimensions: {
                        width,
                        height: 32,
                      },
                    },
                  })
                  // TODO: update element dimensions and output anchor
                }}
              >
                <div className="w-2 h-4 bg-red-400 hover:cursor-move-ew" />
              </Draggable>
            </div>
          </Draggable>
        </div>
      </div>
      {showUnderlay ? (
        <UnderlayPortal parent={id}>
          <div>Howdy from number slider! {id}</div>
        </UnderlayPortal>
      ) : null}
    </>
  )
}

export default React.memo(NumberSlider)
