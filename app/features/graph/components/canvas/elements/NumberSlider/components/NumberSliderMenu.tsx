import React, { useEffect, useRef, useState } from 'react'
import { NodePen } from 'glib'
import { useForm } from 'react-hook-form'
import { coerceValue } from '../utils'
import { useGraphDispatch } from '@/features/graph/store/graph/hooks'

type NumberSliderMenuProps = {
  id: string
  initial: Pick<NodePen.Element<'number-slider'>['current'], 'precision' | 'domain' | 'rounding'> & { value: number }
  onClose: () => void
}

const NumberSliderMenu = ({ id, initial, onClose }: NumberSliderMenuProps): React.ReactElement => {
  const { updateElement } = useGraphDispatch()

  const { register, setValue, handleSubmit, watch, getValues } = useForm<NumberSliderMenuProps['initial']>({
    defaultValues: initial,
  })

  const internalConfiguration = useRef<typeof initial>(initial)
  const internalAll = watch()
  const internalRounding = watch('rounding')
  const internalPrecision = watch('precision')
  const [, internalRange] = coerceValue(watch('domain.1') - watch('domain.0'), internalPrecision)
  const [internalNumericValue, internalValue] = coerceValue(watch('value'), internalPrecision)

  const [hoverPrecision, setHoverPrecision] = useState<number>()
  const precisionEnabled = internalRounding === 'rational'
  const visiblePrecision = precisionEnabled ? hoverPrecision ?? internalPrecision : 0

  const onSubmit = handleSubmit((values) => {
    internalConfiguration.current = values
  })

  const handleCommit = (): void => {
    const { domain, precision, rounding, value } = internalAll

    updateElement({
      id,
      type: 'number-slider',
      data: {
        domain: domain,
        precision,
        rounding,
        values: {
          output: {
            '{0;}': [
              {
                type: 'number',
                data: value,
              },
            ],
          },
        },
      },
    })
    onClose()
  }

  const options: typeof initial['rounding'][] = ['rational', 'integer', 'even', 'odd']
  const labels: { [key in typeof initial['rounding']]: string } = {
    rational: 'R',
    integer: 'N',
    even: 'E',
    odd: 'O',
  }

  return (
    <div className="w-full mb-4 flex flex-col" onPointerDown={(e) => e.stopPropagation()}>
      <form onSubmit={onSubmit}>
        <h4 className="mb-2 text-md text-darkgreen font-semibold">Rounding</h4>
        <div className="w-full mb-4 p-2 flex justify-between items-center rounded-md bg-pale">
          {options.map((option) => (
            <button
              key={`slider-rounding-option-${option}`}
              className={`${
                internalRounding === option ? 'bg-green' : ''
              } w-12 h-12 flex items-center justify-center rounded-md hover:bg-swampgreen`}
              onClick={() => {
                setValue('rounding', option)
                if (option !== 'rational') {
                  setValue('precision', 0)
                  setValue('value', coerceValue(internalNumericValue, 0)[0])
                }
              }}
            >
              <p className="text-xl font-bold font-panel text-darkgreen" style={{ transform: 'translateY(3px)' }}>
                {labels[option]}
              </p>
            </button>
          ))}
        </div>
        <h4 className={`${precisionEnabled ? 'text-darkgreen' : 'text-swampgreen'} mb-2 text-md font-semibold`}>
          Digits
        </h4>
        <div className="w-full mb-4 p-2 h-12 rounded-md bg-pale flex items-center">
          <button
            className={`${visiblePrecision === 0 ? 'rounded-md' : 'rounded-tl-md rounded-bl-md'} ${
              precisionEnabled ? 'bg-green' : 'text-swampgreen'
            } h-full flex-grow flex items-center justify-center font-semibold`}
            onPointerEnter={() => setHoverPrecision(0)}
            onPointerLeave={() => setHoverPrecision(undefined)}
            onClick={() => setValue('precision', 0)}
            disabled={!precisionEnabled}
          >
            0
          </button>
          <div
            className={`${visiblePrecision === 0 ? '' : 'bg-green'} ${
              precisionEnabled ? '' : 'text-swampgreen'
            } h-full flex-grow flex items-center justify-center font-semibold`}
          >
            .
          </div>
          {Array.from(Array(6)).map((_, i) => {
            const isHighlighted = i < visiblePrecision

            return (
              <button
                className={`${isHighlighted ? 'bg-green' : ''} ${
                  visiblePrecision === i + 1 ? 'rounded-tr-md rounded-br-md' : ''
                } ${precisionEnabled ? '' : 'text-swampgreen'} h-full flex-grow font-semibold`}
                key={`precision-button-${i}`}
                onPointerEnter={() => setHoverPrecision(i + 1)}
                onPointerLeave={() => setHoverPrecision(undefined)}
                onClick={() => setValue('precision', (i + 1) as 1 | 2 | 3 | 4 | 5 | 6)}
                disabled={!precisionEnabled}
              >
                0
              </button>
            )
          })}
        </div>
        <div className="w-full mb-4 domain-container">
          <div className="flex flex-col">
            <h4 className="mb-2 text-md text-darkgreen font-semibold">Min</h4>
            <input className="w-full p-2 h-12 rounded-md bg-pale" {...register('domain.0')} />
          </div>
          <div className="w-full h-full flex flex-col justify-end">
            <div className="w-full h-12 flex justify-center items-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="mb-2 text-md text-darkgreen font-semibold">Max</h4>
            <input className="w-full p-2 h-12 rounded-md bg-pale" {...register('domain.1')} />
          </div>
        </div>
        <div className="w-full mb-2 h-8 flex items-center">
          <h4 className="mb-2 text-md text-darkgreen font-semibold">Range</h4>
          <p className="flex-grow text-right text-md text-darkgreen font-panel">{internalRange}</p>
        </div>
        <h4 className="mb-2 text-md text-darkgreen font-semibold">Value</h4>
        <input className="w-full p-2 h-12 rounded-md bg-pale" {...register('value')} />

        <input className="hidden" {...register('rounding')} />
        <input className="hidden" {...register('precision')} />
      </form>
      <div className="w-full mt-4 flex items-center">
        <button className="mr-2 p-4 pt-1 pb-1 rounded-md bg-swampgreen text-darkgreen" onClick={() => handleCommit()}>
          OK
        </button>
        <button className="p-2" onClick={() => onClose()}>
          Cancel
        </button>
      </div>
      <style jsx>{`
        .domain-container {
          display: grid;
          grid-template-columns: 1fr 50px 1fr;
        }
      `}</style>
    </div>
  )
}

export default React.memo(NumberSliderMenu)
