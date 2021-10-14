import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NodePen } from 'glib'
import { DraggableData } from 'react-draggable'
import { ElementContainer, ParameterIcon } from '../../common'
import { UnderlayPortal } from '../../../underlay'
import { useCursorOverride, useNumberSliderMenuActions } from './hooks'
import { useDebugRender } from '@/hooks'
import { useCameraDispatch, useCameraStaticZoom, useCameraZoomLevel } from '@/features/graph/store/camera/hooks'
import { useGraphDispatch, useGraphSelection } from '@/features/graph/store/graph/hooks'
import { coerceValue, getSliderPosition } from './utils'
import { NumberSliderGrip, NumberSliderMenu } from './components'
import { useSessionManager } from '@/features/common/context/session'
import { distance } from '@/features/graph/utils'
import { FullWidthMenu, GenericMenu } from 'features/graph/components/overlay'

type NumberSliderProps = {
  element: NodePen.Element<'number-slider'>
}

const NumberSlider = ({ element }: NumberSliderProps): React.ReactElement => {
  const { current, id } = element
  const { width: elementWidth, height: elementHeight } = current.dimensions

  useDebugRender(`NumberSlider | ${id}`)

  const { device } = useSessionManager()

  const { updateElement, prepareLiveMotion, dispatchLiveMotion, updateSelection } = useGraphDispatch()
  const selected = useGraphSelection()

  const isSelected = selected.includes(id)

  const { setZoomLock, setMode: setCameraMode } = useCameraDispatch()
  const zoom = useCameraStaticZoom()
  const zoomLevel = useCameraZoomLevel()

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

  // const handleLongPress = useCallback((e: PointerEvent) => {
  //   const { pageX, pageY } = e

  //   showGenericMenuOnRelease.current = true
  //   showGenericMenuAt.current = [pageX, pageY]
  // }, [])

  // const longPressTarget = useLongPress(handleLongPress)

  const primaryPointer = useRef(0)
  const primaryPointerAnchor = useRef<[number, number]>([0, 0])

  const [sliderActive, setSliderActive] = useState(false)
  const sliderTargetRef = useRef<HTMLDivElement>(null)
  const sliderInitialValue = useRef(0)

  const handleStartSlider = useCallback(
    (e: PointerEvent): void => {
      e.stopPropagation()

      setCameraMode('locked')
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
    [internalValue, setCursorOverride, setCameraMode]
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
      e.stopPropagation()

      setCameraMode('locked')
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
    [id, internalWidth, setCursorOverride, prepareLiveMotion, setCameraMode]
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

      setCameraMode('idle')
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
      // e.stopPropagation()

      if (showGenericMenuOnRelease.current) {
        setShowGenericMenu(true)
      }

      showGenericMenuOnRelease.current = false

      handleWindowPointerUp(e.nativeEvent)
    },
    [handleWindowPointerUp]
  )

  const [showEditMenu, setShowEditMenu] = useState(false)
  const editMenuLocation = useRef<[number, number]>([0, 0])

  const onDragStop = useCallback(() => {
    // Block selection if edit menu is visible
    return { selection: showEditMenu }
  }, [showEditMenu])

  return (
    <>
      <ElementContainer
        element={element}
        onStart={onDragStart}
        onDrag={onDrag}
        onStop={onDragStop}
        disabled={sliderActive || resizeActive}
      >
        <>
          <div
            className={`${
              zoomLevel === 'near' ? '' : 'pointer-events-none'
            } h-10 absolute transition-transform duration-300 ease-out z-0`}
            style={{
              width: internalWidth,
              left: 0,
              top: 0,
              transform: zoomLevel === 'near' && device.breakpoint === 'sm' ? 'translateY(-48px)' : 'translateY(0px)',
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <button
                className="w-10 h-10 ml-1 mr-1 rounded-md bg-green flex items-center justify-center pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation()

                  const { pageX: x, pageY: y } = e

                  editMenuLocation.current = [x, y]

                  setShowEditMenu(true)
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => {
                  e.stopPropagation()

                  const { pageX: x, pageY: y } = e

                  editMenuLocation.current = [x, y]

                  setShowEditMenu(true)
                }}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <svg className="w-6 h-6" fill="#093824" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                className="w-10 h-10 ml-1 mr-1 rounded-md bg-green flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <svg className="w-6 h-6" fill="#093824" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                className="w-10 h-10 ml-1 rounded-md bg-green flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <svg className="w-6 h-6" fill="#093824" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div
            className={`${isSelected ? 'bg-green' : 'bg-white'} ${
              zoomLevel === 'far' ? '' : 'shadow-osm'
            } relative p-2 rounded-md border-2 border-dark transition-colors duration-150`}
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
            onDoubleClick={() => {
              if (isSelected) {
                updateSelection({ type: 'id', mode: 'remove', ids: [id] })
              }

              switch (device.breakpoint) {
                case 'sm': {
                  break
                }
                default: {
                  setShowUnderlay(true)
                }
              }
            }}
            onContextMenu={() => {
              console.log('right click')
            }}
            onPointerUp={handlePointerUp}
            style={{ width: internalWidth, height: elementHeight }}
            // ref={longPressTarget}
          >
            <div className="w-full h-full flex items-center pr-2 z-10">
              <div className="h-full flex mr-2 p-1 pr-2 items-center justify-center">
                <ParameterIcon type={zoomLevel === 'far' ? 'none' : 'number'} size="sm" />
                <h3
                  className={`${
                    zoomLevel === 'far' ? 'opacity-0' : 'opacity-100'
                  } ml-2 font-panel font-bold text-sm select-none`}
                  style={{ transform: 'translateY(1px)' }}
                >
                  SLIDER
                </h3>
              </div>
              <div className="h-full flex-grow mr-4" ref={sliderRef}>
                <div className="w-full h-full relative overflow-visible">
                  <div
                    className={`${zoomLevel === 'far' ? 'hidden' : 'absolute'} w-4 h-4 z-10 hover:cursor-move-ew`}
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
                  <div
                    className={`${
                      zoomLevel === 'far' ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    } absolute left-0 top-0 w-full h-full z-0`}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="flex-grow bg-dark" style={{ height: '2px' }} />
                    </div>
                  </div>
                  {showUnderlay ? null : (
                    <div
                      className="absolute pointer-events-none z-0"
                      style={{
                        width: sliderWidth,
                        height: sliderWidth,
                        left: sliderPosition - sliderWidth / 2,
                        top: 34,
                      }}
                    >
                      <div className="w-full h-full pt-4 flex flex-col justify-start items-center overflow-hidden">
                        <div
                          className="w-full h-full flex flex-col justify-start items-center transition-transform duration-300 ease-out"
                          style={{ transform: zoomLevel === 'far' ? 'translateY(-64px)' : 'translateY(0px)' }}
                        >
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
                            <p
                              className="h-10 p-2 pl-4 pr-4 rounded-md text-lg"
                              style={{ transform: 'translateY(-4px)' }}
                            >
                              {internalValueLabel.current}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className={`${zoomLevel === 'far' ? 'pointer-events-none opacity-0' : 'opacity-100'} w-2 h-full absolute`}
              style={{ left: internalWidth - 26, top: 0 }}
              ref={resizeTargetRef}
            >
              <div className="w-full h-full flex items-center justify-center hover:cursor-move-ew">
                <div className="w-full h-4 border-dark border-l-2 border-r-2" />
              </div>
            </div>
            <div className={`absolute w-8 h-full overflow-visible`} style={{ right: -32, top: 0 }}>
              <NumberSliderGrip elementId={id} />
            </div>
          </div>
        </>
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
      {showEditMenu ? (
        <FullWidthMenu start={editMenuLocation.current}>
          <div className="w-full p-4">
            <NumberSliderMenu
              id={id}
              initial={{ rounding, precision, domain, value: internalValue }}
              onClose={() => setShowEditMenu(false)}
            />
          </div>
        </FullWidthMenu>
      ) : null}
    </>
  )
}

export default React.memo(NumberSlider)
