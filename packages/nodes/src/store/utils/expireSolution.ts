import type { NodesAppState } from '../state'

export const expireSolution = (state: NodesAppState): void => {
  state.solution.id = crypto.randomUUID()
}
