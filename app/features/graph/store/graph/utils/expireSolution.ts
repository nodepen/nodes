import { newGuid } from 'features/graph/utils'
import { GraphState } from '../types'

export const expireSolution = (state: GraphState): void => {
  state.solution.id = newGuid()
  state.solution.manifest = undefined
}
