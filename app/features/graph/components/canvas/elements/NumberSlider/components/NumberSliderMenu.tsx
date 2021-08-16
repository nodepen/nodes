import React, { useEffect, useRef } from 'react'
import { NodePen } from 'glib'
import { useForm } from 'react-hook-form'

type NumberSliderMenuProps = {
  id: string
  initial: Pick<NodePen.Element<'number-slider'>['current'], 'precision' | 'domain' | 'rounding'> & { value: number }
  onClose: () => void
}

const NumberSliderMenu = ({ id, initial, onClose }: NumberSliderMenuProps): React.ReactElement => {
  const { register, setValue, handleSubmit, watch, getValues } = useForm<NumberSliderMenuProps['initial']>({
    defaultValues: initial,
  })

  const internalConfiguration = useRef<typeof initial>(initial)
  const internalRounding = watch('rounding')
  const internalRange = watch('domain.1') - watch('domain.0')

  const onSubmit = handleSubmit((values) => {
    console.log(values)
    internalConfiguration.current = values
  })

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
              onClick={() => setValue('rounding', option)}
            >
              <p className="text-xl font-bold font-panel text-darkgreen" style={{ transform: 'translateY(3px)' }}>
                {labels[option]}
              </p>
            </button>
          ))}
        </div>
        <h4 className="mb-2 text-md text-darkgreen font-semibold">Digits</h4>
        <div className="w-full mb-4 p-2 h-12 rounded-md bg-pale flex items-center"></div>
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
