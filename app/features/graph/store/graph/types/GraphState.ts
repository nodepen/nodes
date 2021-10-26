import { GrasshopperGraphManifest } from '@/features/graph/types'
import { NodePen } from 'glib'
import { GraphMode } from './GraphMode'

export type GraphState = {
  manifest: GrasshopperGraphManifest
  elements: { [elementId: string]: NodePen.Element<NodePen.ElementType> }
  selection: string[]
  mode: GraphMode
  registry: {
    latest: {
      element: string
    }
    move: {
      elements: string[]
      fromWires: string[]
      toWires: string[]
    }
    wire: {
      origin: {
        elementId: string
        parameterId: string
      }
      primary: string
      capture?: {
        elementId: string
        parameterId: string
      }
    }
  }
}
