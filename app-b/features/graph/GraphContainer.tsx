import { useGraphManager } from '@/context/graph'
import React from 'react'
import { Layout } from './components'
import { DeleteKeyObserver, HistoryHotkeyObserver, SelectionHotkeyObserver } from './components/observer'

export const GraphContainer = (): React.ReactElement => {
  const { registry } = useGraphManager()

  return (
    <>
      <DeleteKeyObserver />
      <HistoryHotkeyObserver />
      <SelectionHotkeyObserver />
      <div className="w-full flex-grow flex flex-col justify-start overflow-hidden">
        <Layout.Controls />
        <div
          className="w-full flex-grow relative bg-pale"
          style={{ WebkitUserSelect: 'none' }}
          ref={registry.layoutContainerRef}
        >
          <div className="w-full h-full absolute z-10">
            <Layout.Canvas />
          </div>
          <div className="w-full h-full absolute z-20 pointer-events-none">
            <Layout.Overlay />
          </div>
        </div>
      </div>
    </>
  )
}
