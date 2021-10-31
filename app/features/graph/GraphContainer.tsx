import React from 'react'
import dynamic from 'next/dynamic'
import { Layout } from './components'
import { useGraphManager } from '@/features/graph/context/graph'
import { DeleteKeyObserver, HistoryHotkeyObserver, SelectionHotkeyObserver } from './components/observer'
import { useSceneDisplayMode } from './store/scene/hooks'

export const GraphContainer = (): React.ReactElement => {
  const { registry } = useGraphManager()

  const Scene = dynamic(() => import('./components/scene/SceneContainer'))

  const mode = useSceneDisplayMode()

  return (
    <>
      <DeleteKeyObserver />
      <HistoryHotkeyObserver />
      <SelectionHotkeyObserver />
      <div className="w-full flex-grow relative overflow-hidden">
        <div className="absolute w-full h-full left-0 top-0 z-0">
          <div className="w-full h-full flex flex-col justify-start overflow-hidden">
            <Layout.Controls />
            <div
              className="w-full flex-grow relative bg-pale"
              style={{ WebkitUserSelect: 'none' }}
              ref={registry.layoutContainerRef}
            >
              <div className="w-full h-full absolute z-10">
                <Layout.Canvas />
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute w-full h-full top-0 z-10 transition-all duration-300 ease-out pointer-events-none"
          style={{ left: mode === 'show' ? '0%' : '105%' }}
        >
          <Scene />
        </div>
      </div>
    </>
  )
}
