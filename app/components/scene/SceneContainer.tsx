import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { LoadingOverlay } from '../common'
import { SceneManager } from './lib/context'

export const SceneContainer = (): React.ReactElement => {
  const Scene = dynamic(import('./Scene'), { ssr: false })

  const config = useMemo(() => ({ draw: 'default' as 'default' | 'selection' }), [])

  return (
    <SceneManager>
      <main className="w-full overflow-hidden" style={{ height: '100vh' }}>
        <div className="w-full h-full bg-pale flex flex-col items-center">
          <div className="w-full h-12 bg-green z-10" />
          <Scene config={config} />
        </div>
      </main>
    </SceneManager>
  )
}
