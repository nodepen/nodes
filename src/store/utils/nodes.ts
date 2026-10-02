import type { NodesAppState } from '../state'
import type * as NodePen from '@/types'

export const addDocumentNode = (state: NodesAppState, node: NodePen.DocumentNode): void => {
    if (!(node.instanceId in state.document.nodes)) {
        state.registry.documentNodeIds.push(node.instanceId)
    }
    state.document.nodes[node.instanceId] = node
}

export const removeDocumentNode = (state: NodesAppState, nodeInstanceId: string): void => {
    if (!(nodeInstanceId in state.document.nodes)) {
        return
    }

    delete state.document.nodes[nodeInstanceId]

    const index = state.registry.documentNodeIds.indexOf(nodeInstanceId)
    if (index !== -1) {
        state.registry.documentNodeIds.splice(index, 1)
    }
}

export const setDocumentNodes = (state: NodesAppState, nodes: Record<string, NodePen.DocumentNode>): void => {
    state.document.nodes = nodes
    state.registry.documentNodeIds = Object.keys(nodes)
}
