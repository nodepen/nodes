import { NodePen } from 'glib'

export type SolutionState = {
  meta: {
    id?: string
    phase?: 'expired' | 'scheduled' | 'downloading' | 'idle'
    /** Store details about NodePen errors during solve. */
    error?: string
    /** Duration of the previous run */
    duration?: number
  }
  values: {
    [elementId: string]: {
      [parameterId: string]: NodePen.DataTree
    }
  }
  messages: {
    [elementId: string]: any // TODO: bring back runtimeMessage types
  }
}
