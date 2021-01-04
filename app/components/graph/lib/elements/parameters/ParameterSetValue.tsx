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

  return mode === 'idle' ? (
    <button
      onClick={() => setMode('setting')}
      className="block w-full mt-1 p-1 text-center border-2 rounded-sm border-dashed border-green text-xs font-bold text-green hover:border-darkgreen hover:text-darkgreen"
    >
      Set value
    </button>
  ) : (
      <div className="w-full flex justify-between items-center mt-1">
        <input type="text" className="w-32 h-6 bg-pale p-1 border-2 border-green rounded-sm text-darkgreen text-sm font-panel" />
        <button className="w-6 h-6 ml-2 mr-2 rounded-full border-2 border-green">

        </button>
      </div>

    )
}