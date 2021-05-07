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

  const getMessage = (status: string): JSX.Element => {
    switch (status) {
      case 'WAITING': {
        return null
      }
      case 'SUCCEEDED': {
        return <p className="font-panel text-sm">Succeeded in {duration}ms</p>
      }
      case 'FAILED': {
        return <p className="font-panel text-sm">Failed for unknown reasons.</p>
      }
      case 'TIMEOUT': {
        return <p className="font-panel text-sm">Solution exceeded 750ms limit.</p>
      }
      default: {
        return null
      }
    }
  }

  const getIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'WAITING': {
        return (
          <svg
            className="w-6 h-6 ml-2 mr-1 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      }
      case 'SUCCEEDED': {
        return (
          <svg
            className="w-6 h-6 ml-2 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      }
      case 'FAILED':
      case 'TIMEOUT': {
        return (
          <svg
            className="w-6 h-6 ml-2 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      }
      default: {
        return null
      }
    }
  }

  return (
    <div className="w-full h-12 p-2 pl-8 pr-8 bg-green flex flex-row justify-start items-center z-10">
      <button
        onClick={handleRefresh}
        className="p-2 h-6 mr-2 rounded-full border-2 border-swampgreen flex flex-row items-center justify-center font-display text-sm"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh
      </button>
      <button
        onClick={handleReset}
        className="p-2 h-6 mr-2 rounded-full border-2 border-swampgreen flex flex-row items-center justify-center font-display text-sm"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Reset
      </button>
      <button
        onClick={handleRecenter}
        className="p-2 h-6 mr-2 rounded-full border-2 border-swampgreen flex flex-row items-center justify-center font-display text-sm"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
        Recenter
      </button>
      <div className="h-full flex-grow flex flex-row items-center justify-end">
        {getMessage(status)}
        {getIcon(status)}
      </div>
    </div>
  )
}
