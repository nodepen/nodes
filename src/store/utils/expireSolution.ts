import { ulid } from 'ulid'
import type { NodesAppState } from '../state'
import { saveDocument } from './saveDocument'

export const expireSolution = (state: NodesAppState): void => {
    // Flag solution as expired
    state.solution = {
        solutionId: ulid(),
        documentRuntimeData: null,
        nodeSolutionData: {}
    }

    // Trigger save
    saveDocument(state)
}
