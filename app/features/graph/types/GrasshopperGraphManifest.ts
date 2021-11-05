import { NodePen } from 'glib'

export type GrasshopperGraphManifest = {
  id: string
  name: string
  author: string
  elements: { [elementId: string]: NodePen.Element<NodePen.ElementType> }
}
