import React from 'react'
import { LoadingOverlay } from '../common'
import { Controls, Canvas } from './lib/layout'

export const GraphContainer = (): React.ReactElement => {
  return (
    <main className="w-full flex-grow overflow-hidden" id="graph-container">
      <LoadingOverlay>
        <div className="w-full h-full bg-pale flex flex-col items-center">
          <div className="w-full h-12 bg-green z-10" />
          <Canvas />
          <Controls />
        </div>
      </LoadingOverlay>
    </main>
  )
}
