import React, { useCallback, useEffect, useState } from 'react'
import { NodePen } from 'glib'
import Draggable from 'react-draggable'
import { ElementContainer } from '../../common'
import { UnderlayPortal } from '../../../underlay'
import { useDebugRender } from '@/hooks'
import { useCameraDispatch, useCameraStaticZoom } from '@/features/graph/store/camera/hooks'
import { useGraphDispatch } from '@/features/graph/store/graph/hooks'

type NumberSliderProps = {
  element: NodePen.Element<'number-slider'>
}

const INITIAL_WIDTH = 125

const NumberSlider = ({ element }: NumberSliderProps): React.ReactElement => {
  const { current, id } = element

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

  const [showUnderlay, setShowUnderlay] = useState(false)

  const onDragStart = useCallback((): void => {
    setShowUnderlay(false)
  }, [])

  return (
    <>
      <ElementContainer element={element} onStart={onDragStart}>
        <div
          className="h-8 p-2 bg-white flex items-center justify-start"
          onDoubleClick={() => {
            setShowUnderlay(true)
          }}
          style={{ width }}
        >
          <div className="h-full flex mr-2 p-1 pl-2 pr-2 items-center justify-center border-2 border-dark">Slider</div>
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
            bounds={{ left: 0, right: 300 }}
            position={{ x: width - INITIAL_WIDTH, y: 0 }}
            scale={zoom}
            onMouseDown={(e) => e.stopPropagation()}
            onStart={(e, _) => {
              e.stopPropagation()
              setShowUnderlay(false)
              setZoomLock(true)
              setIsDragging(true)
            }}
            onDrag={(_, d) => {
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
                  anchors: {
                    output: [width + 2, -16],
                  },
                },
              })
            }}
          >
            <div className="w-2 h-4 bg-red-400 hover:cursor-move-ew" />
          </Draggable>
        </div>
      </ElementContainer>
      {showUnderlay ? (
        <UnderlayPortal parent={id}>
          <div>Howdy from number slider! {id}</div>
        </UnderlayPortal>
      ) : null}
    </>
  )
}

export default React.memo(NumberSlider)
