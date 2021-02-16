import React, { useState, useEffect } from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { Grip, DataTree, Loading } from './common'
import { useElementStatus } from './utils'
import { Input } from '@/components'

type NumberSliderProps = {
  instanceId: string
}

type NumberSliderMode = 'input' | 'edit'

export const NumberSlider = ({ instanceId: id }: NumberSliderProps): React.ReactElement => {
  const {
    store: { elements, solution },
    dispatch,
  } = useGraphManager()

  const slider = elements[id] as Glasshopper.Element.NumberSlider

  const [status, color] = useElementStatus(id)

  const { position, domain, precision, values } = slider.current

  const value = values['{0}'][0].data as number

  const [isSliding, setIsSliding] = useState(false)
  const [initialValue, setInitialValue] = useState(0)
  const [[x, y], setAnchor] = useState<[number, number]>([0, 0])
  const [currentValue, setCurrentValue] = useState(value)

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>): void => {
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
  const sliderPosition = (currentValue / (max - min)) * 224

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
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
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
    // Fix any values that don't make sense

    // Commit new values and expire solution

    // Update component mode
    setMode('input')
  }

  return (
    <div className="absolute flex flex-row" style={{ left: dx - 128, top: -dy - 20 }}>
      <div className="relative w-64 h-10 ">
        <div
          className="relative w-full h-full p-4 rounded-md border-2 border-dark shadow-osm bg-white flex flex-row items-center overflow-visible z-30"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          role="presentation"
        >
          <div className="w-full relative bg-dark overflow-visible" style={{ height: '2px' }}>
            <button
              className={`${
                isSliding ? 'bg-green' : 'bg-white'
              } w-4 h-4 absolute rounded-sm border-2 border-dark hover:bg-green transition-colors duration-150`}
              style={{ top: -7, left: sliderPosition - 10, transform: 'rotate(45deg)' }}
              onPointerDown={handlePointerDown}
              onMouseDown={(e) => e.stopPropagation()}
            ></button>
          </div>
        </div>
        {mode === 'input' ? (
          <button
            className="absolute w-8 h-8 rounded-full border-2 border-green bg-pale flex justify-center items-center"
            style={{ left: -38, top: 6 }}
            onClick={handleStartEdit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#98E2C6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
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
                    onChange={(value) => setEditValue(Number.parseFloat(value))}
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
                <div className="w-32 pl-2 flex flex-row items-center justify-between">
                  <button className="w-6 h-6 rounded-full border-2 border-green flex items-center justify-center">
                    -
                  </button>
                  <p className="font-medium text-lg">.{editPrecision}</p>
                  <button className="w-6 h-6 rounded-full border-2 border-green items-center justify-center">+</button>
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
