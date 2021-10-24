import { SolutionState } from './SolutionState'

export type ExpireSolutionPayload = {
  id: string
}

export type UpdateSolutionPayload = {
  meta: SolutionState['meta']
  messages?: SolutionState['messages']
}

export type ApplySolutionValuesPayload = {
  solutionId: string
  values: any[]
}
