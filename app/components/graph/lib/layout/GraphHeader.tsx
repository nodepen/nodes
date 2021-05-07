import React from 'react'
import { useGraphManager } from '@/context/graph'

export const GraphHeader = (): React.ReactElement => {
  const { store, dispatch } = useGraphManager()

  const { status, duration } = store.solution

  const handleRefresh = (): void => {
    dispatch({ type: 'session/expire-solution' })
  }

  const handleReset = (): void => {
    dispatch({ type: 'graph/clear' })
  }

  const handleRecenter = (): void => {
    dispatch({ type: 'camera/reset' })
  }

  return (
    <div className="w-full h-12 p-2 pl-8 pr-8 bg-green flex flex-row justify-start items-center z-10">
      <button
        onClick={handleRefresh}
        className="p-2 h-6 mr-2 rounded-full border-2 border-swampgreen flex flex-row items-center justify-center"
      >
        Refresh
      </button>
      <button
        onClick={handleReset}
        className="p-2 h-6 mr-2 rounded-full border-2 border-swampgreen flex flex-row items-center justify-center"
      >
        Reset
      </button>
      <button
        onClick={handleRecenter}
        className="p-2 h-6 mr-2 rounded-full border-2 border-swampgreen flex flex-row items-center justify-center"
      >
        Recenter
      </button>
      <div className="h-full flex-grow flex flex-row items-center justify-end">
        {duration} - {status}
      </div>
    </div>
  )
}
