import { current } from "immer";
import type { NodesAppState } from "../state";

export const saveDocument = (state: NodesAppState): void => {
    // Update undo/redo history
    const { stack, currentDepth, maximumDepth, isActive } = state.history

    if (!isActive) {
        state.history.stack = [current(state.document), ...stack.slice(currentDepth, maximumDepth)]
        state.history.currentDepth = 0
    }

    // Emit save
    state.callbacks.onSaveDocument?.(state)
}