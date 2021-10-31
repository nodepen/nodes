import { SetTransform } from '@/features/graph/types'
import { Grasshopper } from 'glib'
import React from 'react'

export type GraphStore = {
  library?: Grasshopper.Component[]
  registry: {
    setTransform?: SetTransform
    canvasContainerRef: React.RefObject<HTMLDivElement>
    layoutContainerRef: React.RefObject<HTMLDivElement>
    sceneContainerRef: React.RefObject<HTMLDivElement>
    portals: {
      [id: string]: React.RefObject<HTMLDivElement>
    }
  }
  register: {
    setTransform: (setTransform: SetTransform) => void
    portal: {
      add: (id: string, ref: React.RefObject<HTMLDivElement>) => void
      remove: (id: string) => void
    }
  }
}
