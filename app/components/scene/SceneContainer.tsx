import React from 'react'
import { LoadingOverlay } from '../common'

export const SceneContainer = (): React.ReactElement => {
  return (
    <main className="w-full flex-grow overflow-hidden">
      <LoadingOverlay>
        <div className="w-full h-full bg-pale flex flex-col items-center">
          <div className="w-full h-12 bg-green z-10" />
          Scene stuff
        </div>
      </LoadingOverlay>
    </main>
  )
}
