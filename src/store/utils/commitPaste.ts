import type * as NodePen from '@/types'
import type { NodesAppState } from "../state";
import { expireSolution } from './expireSolution';
import { addDocumentNode } from './nodes';
import { current } from 'immer';
import { duplicateInstance } from '@/utils/nodes/duplicateInstance';
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate';
import { tryGetTemplate } from '@/utils/templates/tryGetTemplate';
import { getClusterByNodeInstanceId } from '@/utils/clusters/getClusterForNode';

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

    // Recreate cluster side-table entries for pasted cluster nodes
    for (const node of current(state.clipboard.nodes)) {
        const nodeType = getNodeTypeForTemplate(tryGetTemplate(node.templateId))

        if (nodeType !== 'cluster') {
            continue
        }

        const cluster = getClusterByNodeInstanceId(state.document, node.instanceId)

        if (!cluster) {
            continue
        }

        state.document.clusters[newInstanceIdMap[node.instanceId]] = {
            instanceId: newInstanceIdMap[node.instanceId],
            ref: cluster.ref,
            meta: cluster.meta,
            nodeInstanceId: newInstanceIdMap[node.instanceId]
        }
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
                nodeInstanceId: newInstanceIdMap[source.nodeInstanceId] ?? source.nodeInstanceId,
                portInstanceId: newInstanceIdMap[source.portInstanceId] ?? source.portInstanceId
            }))
        }

        // Add final copies to document
        addDocumentNode(state, node)
    }

    // Update selection to new copies
    state.registry.selection.nodes = newInstances.map((node) => node.instanceId)

    expireSolution(state)
}