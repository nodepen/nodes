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
          <button onClick={handleToggleMode}>Toggle</button>
        </div>
        <Scene>
          <Geometry config={{ draw: mode }} elements={elements} selection={selection} />
        </Scene>
      </div>
    </main>
  )
}
