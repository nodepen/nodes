import { current } from 'immer'
import type { NodesAppState } from '../state'

export const removeDocumentCluster = (state: NodesAppState, clusterInstanceId: string): void => {
    if (!state.document.clusters?.[clusterInstanceId]) {
        return
    }

    delete state.document.clusters[clusterInstanceId]

    state.callbacks.onDeleteCluster?.(current(state), { clusterInstanceId })
}
