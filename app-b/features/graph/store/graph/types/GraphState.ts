import { NodePen } from 'glib'
import { GraphMode } from './GraphMode'

export type GraphState = {
  elements: { [id: string]: NodePen.Element<NodePen.ElementType> }
  selection: []
  mode: GraphMode
  registry: {
    move: {
      elements: string[]
      fromWires: string[]
      toWires: string[]
    }
    wire: {
      /** @deprecated */
      source: {
        type: 'input' | 'output'
        elementId: string
        parameterId: string
      }
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
