import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NodePen } from 'glib'
import Draggable from 'react-draggable'
import { ElementContainer, ParameterIcon } from '../../common'
import { UnderlayPortal } from '../../../underlay'
import { useCursorOverride } from './hooks'
import { useDebugRender } from '@/hooks'
import { useCameraDispatch, useCameraStaticZoom } from '@/features/graph/store/camera/hooks'
import { useGraphDispatch } from '@/features/graph/store/graph/hooks'
import { coerceValue, getSliderPosition, getSliderStep } from './utils'
import { NumberSliderMenu } from './components'

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
  const internalValueLabel = useRef<string>(currentValue.toString())

  const handleSetInternalValue = (value: number): void => {
    const [v, l] = coerceValue(value, precision)

    internalValueLabel.current = l
    setInternalValue(v)
  }

  useEffect(() => {
    handleSetInternalValue(currentValue as number)
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

  const sliderPosition = getSliderPosition(internalValue, [min, max], sliderWidth)
  const sliderStep = getSliderStep(rounding, precision, domain, sliderWidth)

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
            <div className="h-full flex-grow mr-4" ref={sliderRef}>
              <div className="w-full h-full relative overflow-visible">
                <Draggable
                  axis="x"
                  grid={[sliderStep, 0]}
                  bounds={{ left: -8, right: sliderWidth - 8 }}
                  position={{ x: sliderPosition - 8, y: 3 }}
                  onStart={(e, _d) => {
                    e.stopPropagation()
                    setCursorOverride(true)
                  }}
                  onDrag={(e, d) => {
                    const { x } = d
                    const pct = (x + 8) / sliderWidth
                    const range = max - min

                    const v = pct * range + min

                    handleSetInternalValue(v)
                  }}
                  onStop={(_e, _d) => {
                    setCursorOverride(false)

                    updateElement({
                      id,
                      type: 'number-slider',
                      data: {
                        values: {
                          output: {
                            '{0;}': [
                              {
                                type: 'number',
                                data: internalValue,
                              },
                            ],
                          },
                        },
                      },
                    })
                  }}
                >
                  <div className="absolute w-4 h-4 z-10 hover:cursor-move-ew">
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className="w-3 h-3 rounded-sm border-2 border-dark bg-white"
                        style={{ transform: 'rotate(45deg)', transformOrigin: '50% 50%' }}
                      />
                    </div>
                  </div>
                </Draggable>
                {showUnderlay ? null : (
                  <div
                    className="absolute pointer-events-none"
                    style={{ width: sliderWidth, height: sliderWidth, left: sliderPosition - sliderWidth / 2, top: 45 }}
                  >
                    <div className="w-full h-full flex flex-col justify-start items-center">
                      <div
                        className="w-6 h-6 rounded-sm bg-green"
                        style={{ transform: 'rotate(45deg)', transformOrigin: '50% 50%' }}
                      />
                      <div className="bg-green rounded-md" style={{ transform: 'translateY(-16px)' }}>
                        <p className="h-10 p-2 pl-4 pr-4 rounded-md text-lg" style={{ transform: 'translateY(-4px)' }}>
                          {internalValueLabel.current}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute left-0 top-0 w-full h-full z-0">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="flex-grow bg-dark" style={{ height: '2px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Draggable
            axis="x"
            bounds={{ left: initialWidth.current - 34, right: initialWidth.current + 300 }}
            position={{ x: internalWidth - 34, y: -22 }}
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
          <div className="absolute w-8 h-full overflow-visible" style={{ right: -32, top: 0 }}>
            <div className="relative w-full h-full">
              <div className="absolute w-full h-full" style={{ left: -7 }}>
                <div className="w-full h-full flex items-center">
                  <svg className="w-4 h-4 overflow-visible" viewBox="0 0 10 10">
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
                    <path d="M5,20 a1,1 0 0,0 0,-30" fill="#FFF" opacity="0" stroke="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ElementContainer>
      {showUnderlay ? (
        <UnderlayPortal parent={id}>
          <div className="w-full pt-8 flex flex-col items-center bg-green rounded-md">
            <div className="flex flex-col items-center" style={{ maxWidth: 300 }}>
              <NumberSliderMenu
                id={id}
                initial={{ rounding, precision, domain, value: internalValue }}
                onClose={() => setShowUnderlay(false)}
              />
            </div>
          </div>
        </UnderlayPortal>
      ) : null}
    </>
  )
}

export default React.memo(NumberSlider)
