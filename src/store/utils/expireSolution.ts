import type { NodesAppState } from '../state'

export const expireSolution = (state: NodesAppState): void => {
    // Flag internal solution state as expired for UI updates
    state.solution.isExpired = true

    // Fire registered callback
    state.callbacks.onExpireSolution?.(state)
}
