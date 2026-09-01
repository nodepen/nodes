import type { NodesAppState } from '../state'

type DragSelectionState = Pick<NodesAppState, 'document' | 'registry'>

/**
 * Currently included in a drag:
 * - Directly selected nodes
 * - Nodes in a selected group
 */
export const getNodesIncludedInDrag = (state: DragSelectionState): string[] => {
    const included = new Set(state.registry.selection.nodes)

    for (const groupId of state.registry.selection.groups) {
        for (const nodeInstanceId of state.document.groups[groupId]?.items.nodes ?? []) {
            included.add(nodeInstanceId)
        }
    }

    return [...included]
}
