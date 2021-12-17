import React from 'react'
import { Layout } from '..'
import { useGraphManager } from '@/features/graph/context/graph'
import {
  DeleteKeyObserver,
  HistoryHotkeyObserver,
  SelectionHotkeyObserver,
  SpaceBarObserver,
  VisibilityObserver,
} from '../observer'
import { useSceneDisplayMode } from '../../store/scene/hooks'

export const GraphContainer = (): React.ReactElement => {
  const { registry } = useGraphManager()

  const mode = useSceneDisplayMode()

  return (
    <>
      <DeleteKeyObserver />
      <HistoryHotkeyObserver />
      <SelectionHotkeyObserver />
      <SpaceBarObserver />
      <VisibilityObserver />
      <div className="w-full flex-grow relative overflow-hidden">
        <div className="absolute w-full h-full left-0 top-0 z-0">
          <div className="w-full h-full flex flex-col justify-start overflow-hidden">
            <Layout.Controls />
            <div
              className="w-full flex-grow relative bg-pale"
              style={{ WebkitUserSelect: 'none' }}
              ref={registry.layoutContainerRef}
            >
              <div
                className="w-full h-full absolute z-10 transition-all duration-300 ease-out"
                style={{ left: mode === 'show' ? '-105%' : '0%' }}
              >
                <Layout.Canvas />
              </div>
              <div
                className="absolute w-full h-full top-0 z-10 transition-all duration-300 ease-out pointer-events-none"
                ref={registry.sceneContainerRef}
                style={{ left: mode === 'show' ? '0%' : '105%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
