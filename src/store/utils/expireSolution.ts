import type { NodesAppState } from '../state'
import { saveDocument } from './saveDocument'

export const expireSolution = (state: NodesAppState): void => {
    // Flag internal solution state as expired for UI updates
    state.solution.isExpired = true

    // Fire registered callback
    state.callbacks.onExpireSolution?.(state)

    // Trigger save
    saveDocument(state)
}
