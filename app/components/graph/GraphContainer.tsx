import React from 'react'
import { LoadingOverlay, Controls } from './lib/layout'

export const GraphContainer = (): React.ReactElement => {
  return (
    <main className="w-full flex-grow overflow-hidden">
      <LoadingOverlay>
        <div className="w-full h-full bg-pale flex flex-col items-center">
          <div className="w-full h-12 bg-green" />
          <div className="w-full flex-grow bg-pale" />
          <Controls />
        </div>
      </LoadingOverlay>
    </main>
  )
}