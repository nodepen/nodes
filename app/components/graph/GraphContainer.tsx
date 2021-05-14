import React, { useEffect, useState } from 'react'
import { LoadingOverlay } from '../common'
import { Controls, Canvas, Header } from './lib/layout'

export const GraphContainer = (): React.ReactElement => {
  const [minHeight, setMinHeight] = useState(0)

  useEffect(() => {
    setMinHeight(window.innerHeight - 40)
  }, [])

  return (
    <main className="w-full flex-grow overflow-hidden" id="graph-container">
      <div className="w-full h-full bg-pale flex flex-col items-center" style={{ height: minHeight }}>
        <Header />
        <Canvas />
        <Controls />
      </div>
    </main>
  )
}
