import { NodePen } from 'glib'
import { GraphMode } from './GraphMode'

export type GraphState = {
  elements: { [id: string]: NodePen.Element<NodePen.ElementType> }
  selection: string[]
  solution: {
    id?: string
    manifest?: unknown
  }
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
