import React, { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { DrawMode } from './lib/types'
import { useGraphManager } from '@/context/graph'
import { useSceneManager } from './lib/context'

export const SceneContainer = (): React.ReactElement => {
  const Scene = useMemo(() => dynamic(import('./Scene'), { ssr: false }), [])
  const Geometry = dynamic(import('./SceneGeometry'), { ssr: false })

  const {
    store: { elements },
  } = useGraphManager()

  const {
    store: { selection },
  } = useSceneManager()

  const [mode, setMode] = useState<DrawMode>('default')

  const handleToggleMode = (): void => {
    setMode((current) => (current === 'default' ? 'selection' : 'default'))
  }

  return (
    <main className="w-full overflow-hidden" style={{ height: '100vh' }}>
      <div className="w-full h-full bg-pale flex flex-col items-center">
        <div className="w-full h-12 p-2 pl-8 pr-8 flex flex-row justify-start items-center bg-green z-10">
          <button
            onClick={handleToggleMode}
            className={`${
              mode === 'selection' ? 'bg-swampgreen' : ''
            } p-2 h-6 mr-2 rounded-full border-2 border-swampgreen flex flex-row items-center justify-center font-display text-sm`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <p className="ml-2 hidden md:block">Only show selected</p>
          </button>
        </div>
        <Scene>
          <Geometry config={{ draw: mode }} elements={elements} selection={selection} />
        </Scene>
      </div>
    </main>
  )
}
