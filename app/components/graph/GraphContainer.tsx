import React from 'react'
import { useGraphManager } from '@/context/graph'

export const GraphContainer = (): React.ReactElement => {
  const { ready, library } = useGraphManager()

  if (ready) {
    console.log(library)
  }

  return <main className="w-full flex-grow bg-pale overflow-hidden">{ready ? 'Ready!' : 'Not ready.'}</main>
}