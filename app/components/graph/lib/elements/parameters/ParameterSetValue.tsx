import React, { useState, useEffect } from 'react'
import { useGraphManager } from '@/context/graph'

type ParameterSetValueProps = {
  element: string
  keepOpen: () => void
}

export const ParameterSetValue = ({ element: id, keepOpen }: ParameterSetValueProps): React.ReactElement => {
  const { dispatch } = useGraphManager()

  const [mode, setMode] = useState<'idle' | 'setting'>('idle')
  const [value, setValue] = useState('0')

  useEffect(() => {
    if (mode === 'setting') {
      keepOpen()
    }
  }, [mode])

  const handleSetValue = (): void => {
    dispatch({ type: 'graph/values/set-one-value', targetElement: id, targetParameter: 'input', value })
  }

  return mode === 'idle' ? (
    <button
      onClick={() => setMode('setting')}
      className="block w-full mt-1 p-1 text-center border-2 rounded-sm border-dashed border-green text-xs font-panel font-semibold text-darkgreen hover:border-darkgreen"
    >
      SET VALUE
    </button>
  ) : (
    <div className="w-full flex justify-between items-center mt-1">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'))
        }}
        className="w-32 h-6 bg-pale p-1 border-2 border-green rounded-sm text-darkgreen text-sm font-panel"
      />
      <button
        onClick={handleSetValue}
        className="w-6 h-6 ml-2 mr-2 flex justify-center items-center rounded-full border-2 border-green hover:border-darkgreen"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  )
}
