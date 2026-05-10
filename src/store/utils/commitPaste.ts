import type * as NodePen from '@/types'
import type { NodesAppState } from "../state";
import { expireSolution } from './expireSolution';
import { current } from 'immer';
import { duplicateInstance } from '@/utils/nodes/duplicateInstance';

type PasteConfig = {
    dx: number
    dy: number
}

export const commitPaste = (state: NodesAppState, config: PasteConfig): void => {
    const { dx, dy } = config

    const newInstances: NodePen.DocumentNode[] = []
    const newInstanceIdMap: Record<string, string> = {
        'input': 'input',
        'output': 'output'
    }

    state.clipboard.pasteCount = state.clipboard.pasteCount + 1

    // Copy literal instance data
    for (const node of current(state.clipboard.nodes)) {
        const { instance, instanceIds } = duplicateInstance(node)
        newInstances.push(instance)
        Object.assign(newInstanceIdMap, instanceIds)
    }

    // Mutate new instances
    for (const node of newInstances) {
        // Move by provided offset
        node.position = {
            x: node.position.x + dx,
            y: node.position.y + dy
        }

        // Update sources
        for (const inputInstanceId of Object.keys(node.sources)) {
            node.sources[inputInstanceId] = node.sources[inputInstanceId].map((source) => ({
                nodeInstanceId: newInstanceIdMap[source.nodeInstanceId],
                portInstanceId: newInstanceIdMap[source.portInstanceId]
            }))
        }

        // Add final copies to document
        state.document.nodes[node.instanceId] = node
    }

    // Update selection to new copies
    state.registry.selection.nodes = newInstances.map((node) => node.instanceId)

    expireSolution(state)
}