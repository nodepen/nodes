import { NodePen } from 'glib'

export type GraphResponse = Omit<NodePen.GraphManifest, 'graph'> & {
  revision: number
}
