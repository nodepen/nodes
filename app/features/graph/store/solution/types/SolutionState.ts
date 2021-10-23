import { NodePen } from 'glib'

export type SolutionState = {
  current: {
    solutionId: string
  }
  data: {
    [solutionId: string]: {
      [elementId: string]: {
        [parameterId: string]: NodePen.DataTree
      }
    }
  }
}
