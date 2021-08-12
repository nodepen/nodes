import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NodePen } from 'glib'
import Draggable from 'react-draggable'
import { ElementContainer } from '../../common'
import { UnderlayPortal } from '../../../underlay'
import { useCursorOverride } from './hooks'
import { useDebugRender } from '@/hooks'
import { useCameraDispatch, useCameraStaticZoom } from '@/features/graph/store/camera/hooks'
import { useGraphDispatch } from '@/features/graph/store/graph/hooks'

type NumberSliderProps = {
  element: NodePen.Element<'number-slider'>
}

const NumberSlider = ({ element }: NumberSliderProps): React.ReactElement => {
  const { current, id } = element
  const { width: elementWidth } = current.dimensions

  useDebugRender(`NumberSlider | ${id}`)

  const { registerElement, updateElement } = useGraphDispatch()

  const { setZoomLock } = useCameraDispatch()
  const zoom = useCameraStaticZoom()

  const initialWidth = useRef(elementWidth)
  const [internalWidth, setInternalWidth] = useState(elementWidth)

  useEffect(() => {
    setInternalWidth(elementWidth)
  }, [elementWidth])

  const [isDragging, setIsDragging] = useState(false)

  useCursorOverride(isDragging)

  const [showUnderlay, setShowUnderlay] = useState(false)

  const onDragStart = useCallback((): void => {
    setShowUnderlay(false)
  }, [])

  return (
    <>
      <ElementContainer element={element} onStart={onDragStart}>
        <div
          className="w-full h-8 p-2 bg-white relative"
          onDoubleClick={() => {
            setShowUnderlay(true)
          }}
          style={{ width: internalWidth }}
        >
          <div className="w-full h-full flex items-center pr-2">
            <div className="h-full flex mr-2 p-1 pl-2 pr-2 items-center justify-center border-2 border-dark">
              Slider
            </div>
            <div className="h-full flex-grow mr-2 bg-gray-300" />
          </div>
          <Draggable
            axis="x"
            bounds={{ left: initialWidth.current - 16, right: initialWidth.current + 300 }}
            position={{ x: internalWidth - 24, y: -16 }}
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
              const next = internalWidth + dx

              setInternalWidth(next < initialWidth.current ? initialWidth.current : next)
            }}
            onStop={() => {
              setZoomLock(false)
              setIsDragging(false)
              updateElement({
                id,
                type: 'number-slider',
                data: {
                  dimensions: {
                    width: internalWidth,
                    height: 32,
                  },
                  anchors: {
                    output: [internalWidth + 2, -16],
                  },
                },
              })
            }}
          >
            <div className="w-2 h-full bg-red-500 hover:cursor-move-ew" />
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
