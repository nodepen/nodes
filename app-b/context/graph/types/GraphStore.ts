import { SetTransform } from '@/features/graph/types'
import { Grasshopper } from 'glib'
import React from 'react'

export type GraphStore = {
  library?: Grasshopper.Component[]
  registry: {
    setTransform?: SetTransform
  }
  register: {
    canvasContainerRef: React.RefObject<HTMLDivElement>
    setTransform: (setTransform: SetTransform) => void
  }
}
