import React, { useEffect, useState } from 'react'
import { LoadingOverlay } from '../common'
import { Controls, Canvas } from './lib/layout'

export const GraphContainer = (): React.ReactElement => {
  const [minHeight, setMinHeight] = useState(0)

  useEffect(() => {
    setMinHeight(window.innerHeight - 40)
  }, [])

  return (
    <main className="w-full flex-grow overflow-hidden" id="graph-container">
      <LoadingOverlay>
        <div className="w-full h-full bg-pale flex flex-col items-center" style={{ minHeight: minHeight }}>
          <div className="w-full h-12 bg-green z-10" />
          <Canvas />
          <Controls />
        </div>
      </LoadingOverlay>
    </main>
  )
}
