import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NodePen } from 'glib'
import Draggable from 'react-draggable'
import { ElementContainer, ParameterIcon } from '../../common'
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
  const { width: elementWidth, height: elementHeight } = current.dimensions

  useDebugRender(`NumberSlider | ${id}`)

  const { updateElement } = useGraphDispatch()

  const { setZoomLock } = useCameraDispatch()
  const zoom = useCameraStaticZoom()

  const { rounding, precision, domain } = current
  const [min, max] = domain

  // Keep internal value in sync with actual current value, but allow for fast-local-temporary changes.
  const { data: currentValue } = current.values['output']['{0;}'][0]
  const [internalValue, setInternalValue] = useState(currentValue as number)

  useEffect(() => {
    setInternalValue(currentValue as number)
  }, [currentValue])

  const sliderRef = useRef<HTMLDivElement>(null)

  const initialWidth = useRef(elementWidth)
  const [internalWidth, setInternalWidth] = useState(elementWidth)
  const [sliderWidth, setSliderWidth] = useState(172)

  useEffect(() => {
    setInternalWidth(elementWidth)
    setSliderWidth((current) => sliderRef?.current?.clientWidth ?? current)
  }, [elementWidth])

  const setCursorOverride = useCursorOverride()

  const [showUnderlay, setShowUnderlay] = useState(false)

  const onDragStart = useCallback((): void => {
    setShowUnderlay(false)
  }, [])

  const sliderPosition = ((internalValue - min) / (max - min)) * sliderWidth

  return (
    <>
      <ElementContainer element={element} onStart={onDragStart}>
        <div
          className="relative p-2 bg-white rounded-md border-2 border-dark shadow-osm"
          onDoubleClick={() => {
            setShowUnderlay(true)
          }}
          style={{ width: internalWidth, height: elementHeight }}
        >
          <div className="w-full h-full flex items-center pr-2">
            <div className="h-full flex mr-2 p-1 pr-2 items-center justify-center">
              <ParameterIcon type="number" size="sm" />
              <h3 className="ml-2 font-panel font-bold text-sm select-none" style={{ transform: 'translateY(1px)' }}>
                SLIDER
              </h3>
            </div>
            <div className="h-full flex-grow mr-2" ref={sliderRef}>
              <div className="w-full h-full relative">
                <div className="absolute w-2 h-2 bg-red-500 rounded-full" style={{ left: sliderPosition }} />
              </div>
            </div>
          </div>
          <Draggable
            axis="x"
            bounds={{ left: initialWidth.current - 16, right: initialWidth.current + 300 }}
            position={{ x: internalWidth - 28, y: -22 }}
            scale={zoom}
            onMouseDown={(e) => e.stopPropagation()}
            onStart={(e, _) => {
              e.stopPropagation()
              setShowUnderlay(false)
              setZoomLock(true)
              setCursorOverride(true)
            }}
            onDrag={(_, d) => {
              const { deltaX: dx } = d
              const next = internalWidth + dx

              setInternalWidth(next < initialWidth.current ? initialWidth.current : next)
              setSliderWidth((current) => sliderRef?.current?.clientWidth ?? current)
            }}
            onStop={() => {
              setZoomLock(false)
              setCursorOverride(false)
              updateElement({
                id,
                type: 'number-slider',
                data: {
                  dimensions: {
                    width: internalWidth,
                    height: elementHeight,
                  },
                  anchors: {
                    output: [internalWidth + 2, -16],
                  },
                },
              })
            }}
          >
            <div className="w-2 h-full flex items-center justify-center hover:cursor-move-ew">
              <div className="w-full h-4 border-dark border-l-2 border-r-2" />
            </div>
          </Draggable>
        </div>
      </ElementContainer>
      {showUnderlay ? (
        <UnderlayPortal parent={id}>
          <div className="w-full pt-8 flex flex-col items-center bg-green rounded-md">
            <div className="flex flex-col items-center" style={{ maxWidth: 300 }}>
              <div className="w-full">Howdy from number slider! {id}</div>
            </div>
          </div>
        </UnderlayPortal>
      ) : null}
    </>
  )
}

export default React.memo(NumberSlider)
