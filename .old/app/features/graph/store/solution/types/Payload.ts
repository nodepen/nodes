import { NodePen } from 'glib'
import { SolutionState } from './SolutionState'

export type ExpireSolutionPayload = {
  id: string
}

export type UpdateSolutionPayload = {
  meta: SolutionState['meta']
}

export type ApplySolutionManifestPayload = {
  solutionId: string
  manifest: {
    duration: number
    messages?: any[]
  }
}

export type ApplySolutionValuesPayload = {
  solutionId: string
  values: (
    | {
        elementId: string
        parameterId: string
        data: NodePen.DataTreeBranch[]
      }
    | {
        elementId: string
        parameterId: string
        values: NodePen.DataTreeBranch[]
      }
  )[]
}
