import { current } from "immer";
import type { NodesAppState } from "../state";
import type { DocumentNode } from "@/types";

export const saveDocument = (state: NodesAppState): void => {
    const snapshot = current(state)

    const nodes: Record<string, DocumentNode> = {}
    for (const [id, node] of Object.entries(snapshot.document.nodes)) {
        if (!node.status.isProvisional) {
            nodes[id] = node
        }
    }

    state.callbacks.onSaveDocument?.({
        ...snapshot,
        document: { ...snapshot.document, nodes }
    })
}
