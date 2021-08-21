import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NodePen } from 'glib'
import { DraggableData } from 'react-draggable'
import { ElementContainer, GripContainer, ParameterIcon } from '../../common'
import { UnderlayPortal } from '../../../underlay'
import { useCursorOverride, useNumberSliderMenuActions } from './hooks'
import { useDebugRender, useLongPress } from '@/hooks'
import { useCameraDispatch, useCameraStaticZoom } from '@/features/graph/store/camera/hooks'
import { useGraphDispatch } from '@/features/graph/store/graph/hooks'
import { coerceValue, getSliderPosition } from './utils'
import { NumberSliderGrip, NumberSliderMenu } from './components'
import { useSessionManager } from '@/features/common/context/session'
import { distance } from '@/features/graph/utils'
import { GenericMenu } from 'features/graph/components/overlay'

type NumberSliderProps = {
  element: NodePen.Element<'number-slider'>
}

const NumberSlider = ({ element }: NumberSliderProps): React.ReactElement => {
  const { current, id } = element
  const { width: elementWidth, height: elementHeight } = current.dimensions

  useDebugRender(`NumberSlider | ${id}`)

  const { device } = useSessionManager()

  const { updateElement, prepareLiveMotion, dispatchLiveMotion } = useGraphDispatch()

  const { setZoomLock } = useCameraDispatch()
  const zoom = useCameraStaticZoom()

  const { rounding, precision, domain } = current
  const [min, max] = domain

  // Keep internal value in sync with actual current value, but allow for fast-local-temporary changes.
  const { data: currentValue } = current.values['output']['{0;}'][0]
  const [internalValue, setInternalValue] = useState(currentValue as number)
  const internalValueLabel = useRef<string>(currentValue.toString())

  const handleSetInternalValue = useCallback(
    (value: number): void => {
      const [v, l] = coerceValue(value, precision)

      internalValueLabel.current = l
      setInternalValue(v)
    },
    [precision]
  )

  useEffect(() => {
    handleSetInternalValue(currentValue as number)
  }, [currentValue, handleSetInternalValue])

  const [internalWidth, setInternalWidth] = useState(elementWidth)

  const sliderRef = useRef<HTMLDivElement>(null)
  const [sliderWidth, setSliderWidth] = useState(172)

  useEffect(() => {
    setInternalWidth(elementWidth)
    setSliderWidth((current) => sliderRef?.current?.clientWidth ?? current)
  }, [elementWidth])

  const setCursorOverride = useCursorOverride()

  const numberSliderMenuActions = useNumberSliderMenuActions(element)
  const [showGenericMenu, setShowGenericMenu] = useState(false)
  const showGenericMenuAt = useRef<[number, number]>([0, 0])
  const showGenericMenuOnRelease = useRef(false)

  const [showUnderlay, setShowUnderlay] = useState(false)
  const underlayFocusElement = useRef<string>()

  useEffect(() => {
    underlayFocusElement.current = undefined
  }, [showUnderlay])
  // const showGenericMenuAt = useRef<[number, number]>([0, 0])
  // const showGenericMenuOnRelease = useRef(false)

  const onDragStart = useCallback((_, d: DraggableData): void | false => {
    const { x, y } = d
    showGenericMenuAt.current = [x, y]
    setShowUnderlay(false)
  }, [])

  const onDrag = useCallback((_, d: DraggableData): void => {
    if (!showGenericMenuOnRelease.current) {
      return
    }

    const { x, y } = d
    const dragDistance = distance(showGenericMenuAt.current, [x, y])

    if (dragDistance > 20) {
      showGenericMenuOnRelease.current = false
    }
  }, [])

  const sliderPosition = getSliderPosition(internalValue, [min, max], sliderWidth)

  const handleLongPress = useCallback((e: PointerEvent) => {
    const { pageX, pageY } = e

    showGenericMenuOnRelease.current = true
    showGenericMenuAt.current = [pageX, pageY]
  }, [])

  const longPressTarget = useLongPress(handleLongPress)

  const primaryPointer = useRef(0)
  const primaryPointerAnchor = useRef<[number, number]>([0, 0])

  const [sliderActive, setSliderActive] = useState(false)
  const sliderTargetRef = useRef<HTMLDivElement>(null)
  const sliderInitialValue = useRef(0)

  const handleStartSlider = useCallback(
    (e: PointerEvent): void => {
      e.stopImmediatePropagation()

      setShowUnderlay(false)

      const { pageX, pageY } = e

      primaryPointer.current = e.pointerId
      primaryPointerAnchor.current = [pageX, pageY]

      sliderInitialValue.current = internalValue

      // TODO: Figure out why this isn't interacting with history correctly
      setSliderWidth((current) => sliderRef?.current?.clientWidth ?? current)

      setSliderActive(true)
      setCursorOverride(true)

      sliderRef.current?.setPointerCapture(e.pointerId)
    },
    [internalValue, setCursorOverride]
  )

  useEffect(() => {
    const sliderGrip = sliderTargetRef.current

    if (!sliderGrip) {
      return
    }

    sliderGrip.addEventListener('pointerdown', handleStartSlider)

    return () => {
      sliderGrip.removeEventListener('pointerdown', handleStartSlider)
    }
  })

  const [resizeActive, setResizeActive] = useState(false)
  const resizeTargetRef = useRef<HTMLDivElement>(null)
  const resizeInitialValue = useRef(0)
  const resizePreviousValue = useRef(0)

  const handleStartResize = useCallback(
    (e: PointerEvent): void => {
      e.stopImmediatePropagation()

      setShowUnderlay(false)

      const { pageX, pageY } = e

      primaryPointer.current = e.pointerId
      primaryPointerAnchor.current = [pageX, pageY]

      resizeInitialValue.current = internalWidth
      resizePreviousValue.current = internalWidth

      setResizeActive(true)
      setCursorOverride(true)

      resizeTargetRef.current?.setPointerCapture(e.pointerId)

      prepareLiveMotion({ anchor: id, targets: [id] })
    },
    [id, internalWidth, setCursorOverride, prepareLiveMotion]
  )

  useEffect(() => {
    const resizeGrip = resizeTargetRef.current

    if (!resizeGrip) {
      return
    }

    resizeGrip.addEventListener('pointerdown', handleStartResize)

    return () => {
      resizeGrip.removeEventListener('pointerdown', handleStartResize)
    }
  })

  const handleWindowPointerMove = useCallback(
    (e: PointerEvent): void => {
      if (e.pointerId !== primaryPointer.current) {
        return
      }

      if (!sliderActive && !resizeActive) {
        return
      }

      const { pageX } = e
      const [anchorX] = primaryPointerAnchor.current

      const dx = (pageX - anchorX) / zoom

      if (sliderActive) {
        const pct = dx / sliderWidth

        const [min, max] = domain
        const range = max - min

        const delta = range * pct
        const next = sliderInitialValue.current + delta

        let rounded = Math.round(next * Math.pow(10, precision)) / Math.pow(10, precision)

        const isEven = rounded % 2 === 0

        switch (rounding) {
          case 'even': {
            rounded = isEven ? rounded : rounded - 1
            break
          }
          case 'odd': {
            rounded = isEven ? rounded - 1 : rounded
            break
          }
        }

        const clamped = rounded < min ? min : rounded > max ? max : rounded

        handleSetInternalValue(clamped)
        return
      }

      if (resizeActive) {
        const next = resizeInitialValue.current + dx

        const clamped = next < 300 ? 300 : next > 450 ? 450 : next

        setInternalWidth(clamped)
        setSliderWidth((current) => sliderRef?.current?.clientWidth ?? current)

        const delta = clamped - resizePreviousValue.current
        dispatchLiveMotion(delta, 0)
        resizePreviousValue.current = clamped

        return
      }
    },
    [
      zoom,
      sliderWidth,
      rounding,
      domain,
      precision,
      handleSetInternalValue,
      sliderActive,
      resizeActive,
      dispatchLiveMotion,
    ]
  )

  const handleWindowPointerUp = useCallback(
    (e: PointerEvent): void => {
      if (e.pointerId !== primaryPointer.current) {
        return
      }

      setCursorOverride(false)

      if (sliderActive) {
        setSliderActive(false)

        // Commit new value
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
      }

      if (resizeActive) {
        setResizeActive(false)
        setZoomLock(false)

        const dx = internalWidth - current.dimensions.width
        const [ax, ay] = current.anchors['output']

        // Commit new dimensions
        updateElement({
          id,
          type: 'number-slider',
          data: {
            dimensions: {
              width: internalWidth,
              height: elementHeight,
            },
            anchors: {
              output: [ax + dx, ay],
            },
          },
        })
      }
    },
    [
      updateElement,
      id,
      current,
      internalWidth,
      internalValue,
      elementHeight,
      sliderActive,
      resizeActive,
      setCursorOverride,
      setZoomLock,
    ]
  )

  useEffect(() => {
    if (!sliderActive && !resizeActive) {
      // Nothing is in motion
      return
    }

    window.addEventListener('pointermove', handleWindowPointerMove)
    window.addEventListener('pointerup', handleWindowPointerUp)

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove)
      window.removeEventListener('pointerup', handleWindowPointerUp)
    }
  })

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (showGenericMenuOnRelease.current) {
        setShowGenericMenu(true)
      }

      showGenericMenuOnRelease.current = false

      handleWindowPointerUp(e.nativeEvent)
    },
    [handleWindowPointerUp]
  )

  return (
    <>
      <ElementContainer element={element} onStart={onDragStart} onDrag={onDrag} disabled={sliderActive || resizeActive}>
        <div
          className="relative p-2 bg-white rounded-md border-2 border-dark shadow-osm"
          role="presentation"
          onMouseDown={(e) => {
            const { pageX, pageY } = e

            switch (e.button) {
              case 1: {
                showGenericMenuAt.current = [pageX, pageY]
                setShowGenericMenu(true)
                break
              }
              default: {
                break
              }
            }
          }}
          onDoubleClick={(e) => {
            const { pageX, pageY } = e

            switch (device.breakpoint) {
              case 'sm': {
                showGenericMenuAt.current = [pageX, pageY]
                setShowGenericMenu(true)
                break
              }
              default: {
                setShowUnderlay(true)
              }
            }
          }}
          onPointerUp={handlePointerUp}
          style={{ width: internalWidth, height: elementHeight }}
          ref={longPressTarget}
        >
          <div className="w-full h-full flex items-center pr-2">
            <div className="h-full flex mr-2 p-1 pr-2 items-center justify-center">
              <ParameterIcon type="number" size="sm" />
              <h3 className="ml-2 font-panel font-bold text-sm select-none" style={{ transform: 'translateY(1px)' }}>
                SLIDER
              </h3>
            </div>
            <div className="h-full flex-grow mr-4" ref={sliderRef}>
              <div className="w-full h-full relative overflow-visible pointer-events-auto">
                <div
                  className="absolute w-4 h-4 z-10 hover:cursor-move-ew"
                  ref={sliderTargetRef}
                  style={{ top: 3, left: sliderPosition - 8 }}
                >
                  <div className="w-full h-full flex items-center pointer-events-auto justify-center overflow-visible">
                    <div
                      className="w-3 h-3 rounded-sm border-2 border-dark bg-white"
                      style={{ transform: 'rotate(45deg)', transformOrigin: '50% 50%' }}
                    />
                  </div>
                </div>
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
                      <div
                        className="bg-green rounded-md pointer-events-auto no-drag"
                        style={{ transform: 'translateY(-16px)' }}
                        onDoubleClick={(e) => {
                          e.stopPropagation()

                          underlayFocusElement.current = 'value'
                          setShowUnderlay(true)
                        }}
                      >
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
          <div className="w-2 h-full absolute" style={{ left: internalWidth - 26, top: 0 }} ref={resizeTargetRef}>
            <div className="w-full h-full flex items-center justify-center hover:cursor-move-ew">
              <div className="w-full h-4 border-dark border-l-2 border-r-2" />
            </div>
          </div>
          <div className="absolute w-8 h-full overflow-visible" style={{ right: -32, top: 0 }}>
            <NumberSliderGrip elementId={id} />
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
                focus={underlayFocusElement.current}
              />
            </div>
          </div>
        </UnderlayPortal>
      ) : null}
      {showGenericMenu ? (
        <GenericMenu
          context={element}
          actions={numberSliderMenuActions}
          position={showGenericMenuAt.current}
          onClose={() => setShowGenericMenu(false)}
        />
      ) : null}
    </>
  )
}

export default React.memo(NumberSlider)
