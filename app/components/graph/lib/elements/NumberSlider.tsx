import React, { useState, useEffect, useRef } from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { Grip, DataTree, Loading, ConfigureButton } from './common'
import { useElementStatus, useSelectableElement, useMoveableElement } from './utils'
import { Input } from '@/components'
import { hotkey } from '@/utils'

type NumberSliderProps = {
  instanceId: string
}

type NumberSliderMode = 'input' | 'edit'

export const NumberSlider = ({ instanceId: id }: NumberSliderProps): React.ReactElement => {
  const {
    store: { elements, activeKeys },
    dispatch,
  } = useGraphManager()

  const slider = elements[id] as Glasshopper.Element.NumberSlider

  const sliderRef = useRef<HTMLDivElement>(null)

  const [isOverHandle, setIsOverHandle] = useState(false)

  useEffect(() => {
    if (!sliderRef) {
      return
    }

    dispatch({ type: 'graph/register-element', ref: sliderRef, id })
  }, [])

  const onMove = (motion: [number, number]): void => {
    if (isOverHandle) {
      return
    }
    dispatch({ type: 'graph/mutation/move-component', id, motion })
  }

  useMoveableElement(onMove, undefined, undefined, sliderRef)

  const onSelect = (): void => {
    switch (hotkey.selectionMode(activeKeys)) {
      case 'replace': {
        dispatch({ type: 'graph/selection-clear' })
        dispatch({ type: 'graph/selection-add', id })
        break
      }
      case 'remove': {
        dispatch({ type: 'graph/selection-remove', id })
        break
      }
      case 'add': {
        dispatch({ type: 'graph/selection-add', id })
        break
      }
    }
  }

  useSelectableElement(onSelect, sliderRef)

  const [status, color] = useElementStatus(id)

  const { position, domain, precision, values } = slider.current

  const value = values['{0}'][0].data as number

  const [isSliding, setIsSliding] = useState(false)
  const [initialValue, setInitialValue] = useState(0)
  const [[x, y], setAnchor] = useState<[number, number]>([0, 0])
  const [currentValue, setCurrentValue] = useState(value)

  const handleRef = useRef<HTMLButtonElement>(null)

  const handlePointerDown = (e: PointerEvent): void => {
    e.stopPropagation()

    if (mode !== 'input') {
      return
    }

    const { pageX, pageY } = e

    setAnchor([pageX, pageY])
    setInitialValue(currentValue)
    setIsSliding(true)
  }

  const [min, max] = domain
  const sliderPosition = ((currentValue - min) / (max - min)) * 224

  const handlePointerMove = (e: PointerEvent): void => {
    if (!isSliding) {
      return
    }

    const { pageX } = e

    const dx = x - pageX

    const stepPerPixel = (max - min) / 224

    const valueDelta = -dx * stepPerPixel

    const candidateValue = initialValue + valueDelta

    if (candidateValue < min) {
      setCurrentValue(min)
      return
    }

    if (candidateValue > max) {
      setCurrentValue(max)
      return
    }

    // Round value to allowed precision
    const f = Math.pow(10, precision)
    const precisionValue = Math.round(candidateValue * f) / f

    setCurrentValue(precisionValue)
  }

  const handlePointerUp = (e: PointerEvent): void => {
    e.stopPropagation()
    setIsSliding(false)
  }

  useEffect(() => {
    if (!isSliding && currentValue !== value) {
      console.log('ready to dispatch solution')
      dispatch({ type: 'graph/update-number-slider', id, value: currentValue, precision, domain })
    }
  }, [isSliding])

  useEffect(() => {
    const handle = handleRef.current

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    if (handle) {
      handle.addEventListener('pointerdown', handlePointerDown)
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)

      if (handle) {
        handle.removeEventListener('pointerdown', handlePointerDown)
      }
    }
  })

  const guaranteeZeros = (number: number, precision: number): string => {
    const current = number.toString()

    const [n, d] = current.split('.')

    const decimals = [...Array(precision)].map((x, i) => d?.[i] ?? '0').join('')

    return `${n}${precision > 0 ? '.' : ''}${decimals}`
  }

  useEffect(() => {
    if (value !== currentValue) {
      console.log(`🐍 Value from compute server did not match client value.`)
      setCurrentValue(value)
    }
  }, [value])

  const [dx, dy] = position

  const [mode, setMode] = useState<NumberSliderMode>('input')

  const [editValue, setEditValue] = useState<number>(0)
  const [editDomain, setEditDomain] = useState<[number, number]>([0, 0])
  const [editPrecision, setEditPrecision] = useState<number>(0)

  useEffect(() => {
    const [min, max] = editDomain

    if (editValue < min) {
      setEditValue(min)
    }

    if (editValue > max) {
      setEditValue(max)
    }
  }, [editDomain])

  const handleEditPrecision = (step: number): void => {
    const proposed = editPrecision + step

    if (proposed < 0 || proposed > 6) {
      return
    }

    setEditPrecision(Math.round(proposed))
  }

  const handleStartEdit = (): void => {
    setMode('edit')

    setEditValue(currentValue)
    setEditDomain(domain)
    setEditPrecision(precision)
  }

  const handleCancelEdit = (): void => {
    setMode('input')
  }

  const handleSubmitEdit = (): void => {
    // Commit new values and expire solution
    dispatch({ type: 'graph/update-number-slider', id, value: editValue, domain: editDomain, precision: editPrecision })

    // Update component mode
    setMode('input')
  }

  return (
    <div className="absolute flex flex-row" style={{ left: dx - 128, top: -dy - 20 }}>
      <div className="relative w-64 h-10 ">
        <div
          className="relative w-full h-full p-4 rounded-md border-2 border-dark shadow-osm flex flex-row items-center overflow-visible transition-colors duration-150 z-30"
          style={{ background: color }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          ref={sliderRef}
          role="presentation"
        >
          <div className="w-full relative bg-dark overflow-visible" style={{ height: '2px' }}>
            <button
              className={`${
                isSliding ? 'bg-green' : 'bg-white'
              } w-4 h-4 absolute rounded-sm border-2 border-dark hover:bg-green transition-colors duration-150`}
              style={{ top: -7, left: sliderPosition - 10, transform: 'rotate(45deg)' }}
              ref={handleRef}
              onMouseDown={(e) => e.stopPropagation()}
            ></button>
          </div>
        </div>
        {mode === 'input' ? (
          <div className="absolute w-8 h-8 justify-center items-center" style={{ left: -38, top: 6 }}>
            <ConfigureButton onClick={handleStartEdit} />
          </div>
        ) : null}
        {mode === 'input' ? (
          <div
            className="absolute w-full h-12 flex flex-col justify-start items-center"
            style={{ top: 46, left: 0, transform: `translateX(${sliderPosition - 112}px)` }}
          >
            <svg width="24" height="24" viewBox="0 0 10 10" className="overflow-visible z-10">
              <polyline points="1,5 9,5 9,7 1,7" fill="#EFF2F2" stroke="none" />
              <polyline
                points="1,5 5,1 9,5"
                fill="#EFF2F2"
                stroke="#98E2C6"
                strokeWidth="2px"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div
              className="w-full h-8 flex flex-row justify-center items-center z-0"
              style={{ transform: 'translateY(-12px)' }}
            >
              <div className="pl-2 pr-2 border-2 rounded-sm bg-pale border-green">
                <p
                  className="font-sans font-medium text-darkgreen select-none"
                  style={{ transform: 'translateY(-1px)' }}
                >
                  {guaranteeZeros(currentValue, precision)}
                </p>
              </div>
            </div>
          </div>
        ) : null}
        {mode === 'edit' ? (
          <div
            className="absolute w-76 flex flex-col rounded-md border-2 border-green bg-pale z-0"
            style={{ left: '-24px', top: '20px' }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div className="w-full h-8 bg-green" />
            <div className="w-full p-2 flex flex-col">
              <div className="w-full flex flex-row justify-evenly mb-1">
                <div className="w-16">
                  <Input.Number
                    value={editDomain[0]}
                    domain={[Number.MIN_SAFE_INTEGER, editDomain[1] - 1]}
                    onChange={(value) => setEditDomain(([, end]) => [Number.parseFloat(value), end])}
                  />
                </div>
                <p className="w-10 text-center">&lt;</p>
                <div className="w-16">
                  <Input.Number
                    value={editValue}
                    domain={editDomain}
                    onChange={(value) => {
                      setEditValue(Number.parseFloat(value))
                    }}
                  />
                </div>
                <p className="w-10 text-center">&lt;</p>
                <div className="w-16">
                  <Input.Number
                    value={editDomain[1]}
                    domain={[editDomain[0] + 1, Number.MAX_SAFE_INTEGER]}
                    onChange={(value) => setEditDomain(([start]) => [start, Number.parseFloat(value)])}
                  />
                </div>
                <div className="w-24 pl-2 flex flex-row items-center justify-between">
                  <button
                    className="w-5 h-5 rounded-full border-2 border-green flex items-center justify-center"
                    onClick={() => handleEditPrecision(-1)}
                  >
                    <svg width="14" height="14" viewBox="0 0 10 10">
                      <line
                        x1={2}
                        y1={5}
                        x2={8}
                        y2={5}
                        stroke="#98E2C6"
                        strokeWidth={2}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </button>
                  <p className="font-medium text-lg">.{editPrecision}</p>
                  <button
                    className="w-5 h-5 rounded-full border-2 border-green flex items-center justify-center"
                    onClick={() => handleEditPrecision(1)}
                  >
                    <svg width="14" height="14" viewBox="0 0 10 10">
                      <line
                        x1={2}
                        y1={5}
                        x2={8}
                        y2={5}
                        stroke="#98E2C6"
                        strokeWidth={2}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                      <line
                        x1={5}
                        y1={2}
                        x2={5}
                        y2={8}
                        stroke="#98E2C6"
                        strokeWidth={2}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="w-full mt-2 flex flex-row items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="p-0 pt-1 flex-grow flex justify-center item-center border-2 border-green rounded-sm font-panel text-sm font-medium text-darkgreen hover:bg-green"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitEdit}
                  className="p-0 pt-1 flex-grow flex justify-center item-center border-2 border-green rounded-sm font-panel text-sm font-medium text-darkgreen hover:bg-green"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="absolute w-8 h-4" style={{ right: '0px', top: '-1.3rem' }}>
          <Loading visible={status === 'waiting'} />
        </div>
        <div className="absolute w-4 h-4 z-20" style={{ right: -8, top: 2 }}>
          <Grip source={{ element: id, parameter: 'output' }} />
        </div>
      </div>
    </div>
  )
}
