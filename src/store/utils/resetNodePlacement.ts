import type { NodesAppState } from '../state'

export const resetNodePlacement = (state: NodesAppState): void => {
    if (!state.layout.nodePlacement.isActive) {
        return
    }

    if (state.layout.nodePlacement.openOnEnd.includes('agent')) {
        state.ui.sidebar.isAgentOpen = true
    }

    state.layout.nodePlacement = {
        isActive: false,
        activeNodeId: null,
        openOnEnd: [],
    }
}
