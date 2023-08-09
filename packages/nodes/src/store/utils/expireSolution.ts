import type { NodesAppState } from '../state'

export const expireSolution = (state: NodesAppState): void => {
  // Clear all solution data and set new solution id.
  // A change in the solution id indicates that a new solution needs to be requested.
  state.solution = {
    solutionId: crypto.randomUUID(),
    documentRuntimeData: {
      durationMs: 0,
    },
    nodeSolutionData: [],
  }

  // Update solution lifecycle flags
  state.lifecycle.solution = 'expired'
  state.lifecycle.model = { status: 'expired', progress: 0, objectCount: 0 }

  // Clear cache of solution data
  state.cache.portSolutionData = {}

  // Fire registered callback
  state.callbacks.onExpireSolution?.(state)
}
