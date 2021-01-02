import React from 'react'
import { useGraphManager } from '@/context/graph'
import { LoadingOverlay } from './lib/layout'

export const GraphContainer = (): React.ReactElement => {
  const { ready, library } = useGraphManager()

  if (ready) {
    console.log(library)
  }

  return (
    <main className="w-full flex-grow overflow-hidden">
      <LoadingOverlay>
        <div className="w-full h-full bg-pale flex flex-col items-center">
          <div className="w-full h-12 bg-green" />
          <div className="w-full flex-grow bg-pale" />
          <div className="w-full h-20 bg-green" />
        </div>
      </LoadingOverlay>
    </main>
  )
}