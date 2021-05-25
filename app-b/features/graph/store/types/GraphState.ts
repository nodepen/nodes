import { NodePen } from 'glib'

export type GraphState = {
  elements: { [id: string]: NodePen.Element<NodePen.ElementType> }
  selection: []
}
