import { current } from "immer";
import type { NodesAppState } from "../state";

export const clearClipboard = (state: NodesAppState): void => {
    state.clipboard.pasteCount = 0
    state.clipboard.nodes = []
}

export const copySelectionToClipboard = (state: NodesAppState): void => {
    state.clipboard.pasteCount = 0
    state.clipboard.nodes = state.registry.selection.nodes
        .filter((id) => !!state.document.nodes[id])
        .map((id) => current(state.document.nodes[id]))
}