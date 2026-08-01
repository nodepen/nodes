import { current } from "immer";
import type { NodesAppState } from "../state";

export const saveDocument = (state: NodesAppState): void => {
    // Emit save
    state.callbacks.onSaveDocument?.(state)
}