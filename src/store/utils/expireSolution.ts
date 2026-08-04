import type { NodesAppState } from '../state'
import { saveDocument } from './saveDocument'

export const expireSolution = (state: NodesAppState): void => {
    // Flag solution as expired locally, optimisitcally
    state.solution.flags = {
        isExpired: true,
        isModelExpired: true,
        isFailed: false
    }

    // Trigger save
    saveDocument(state)
}
