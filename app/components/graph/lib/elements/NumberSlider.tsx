import React, { useState, useEffect } from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { Grip, DataTree } from './common'
import { useElementStatus } from './utils'

type NumberSliderProps = {
  instanceId: string
}

export const NumberSlider = ({ instanceId: id }: NumberSliderProps): React.ReactElement => {
  const {
    store: { elements, solution },
  } = useGraphManager()

  const slider = elements[id] as Glasshopper.Element.NumberSlider

  const [status, color] = useElementStatus(id)

  const { position, domain, precision, value } = slider.current

  const [isSliding, setIsSliding] = useState(false)
  const [initialValue, setInitialValue] = useState(0)
  const [[x, y], setAnchor] = useState<[number, number]>([0, 0])
  const [currentValue, setCurrentValue] = useState(value)

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>): void => {
    e.stopPropagation()

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

    const { pageX, pageY } = e

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

  const handlePointerUp = (): void => {
    setIsSliding(false)

    // dispatch update-slider that also expires solution
  }

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

    return `${n}.${decimals}`
  }

  const [dx, dy] = position

  return (
    <div className="absolute flex flex-row" style={{ left: dx - 128, top: -dy - 20 }}>
      <div
        className="relative w-64 h-10 p-4 rounded-md border-2 border-dark shadow-osm bg-white flex flex-row items-center overflow-visible"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <button
          className="absolute w-8 h-8 rounded-full border-2 border-green bg-pale flex justify-center items-center"
          style={{ left: -42, transform: 'translateY(1px)' }}
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
              <p className="font-sans font-medium text-darkgreen select-none" style={{ transform: 'translateY(-1px)' }}>
                {guaranteeZeros(currentValue, precision)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
