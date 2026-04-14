import type { NodesAppState } from "../state";

export const saveDocument = (state: NodesAppState): void => {
    // TODO: Undo/redo tracking here

    // Emit save
    state.callbacks.onSaveDocument?.(state)
}