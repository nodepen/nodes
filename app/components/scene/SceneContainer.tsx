import React from 'react'
import dynamic from 'next/dynamic'
import { LoadingOverlay } from '../common'
import { SceneManager } from './lib/context'

export const SceneContainer = (): React.ReactElement => {
  const Scene = dynamic(import('./Scene'), { ssr: false })

  return (
    <SceneManager>
      <main className="w-full flex-grow overflow-hidden">
        <LoadingOverlay>
          <div className="w-full h-full bg-pale flex flex-col items-center">
            <div className="w-full h-12 bg-green z-10" />
            <Scene />
          </div>
        </LoadingOverlay>
      </main>
    </SceneManager>
  )
}
