import type * as NodePen from '@/types'
import { newGuid } from '../common'

type DuplicateInfo = {
    instance: NodePen.DocumentNode
    instanceIds: Record<string, string>
}

const swap = (obj: Record<string, unknown>, previousKey: string, nextKey: string): void => {
    if (previousKey === nextKey) {
        return
    }

    if (!(previousKey in obj)) {
        // Nothing to swap!
        return
    }

    obj[nextKey] = structuredClone(obj[previousKey])

    delete obj[previousKey]
}

export const duplicateInstance = (node: NodePen.DocumentNode): DuplicateInfo => {
    const instanceIds: Record<string, string> = {
        'input': 'input',
        'output': 'output'
    }

    const newInstance = structuredClone(node)
    const newInstanceId = newGuid()

    // Mutate top level instance id
    newInstance.instanceId = newInstanceId
    instanceIds[node.instanceId] = newInstanceId

    // Remap input instance ids
    for (const id of Object.keys(newInstance.inputs)) {
        if (id === 'input') {
            continue
        }

        const newInputInstanceId = newGuid()
        instanceIds[id] = newInputInstanceId

        swap(newInstance.inputs, id, newInputInstanceId)
    }

    // Remap output instance ids
    for (const id of Object.keys(newInstance.outputs)) {
        if (id === 'output') {
            continue
        }

        const newOutputInstanceId = newGuid()
        instanceIds[id] = newOutputInstanceId

        swap(newInstance.outputs, id, newOutputInstanceId)
    }

    // Mutate new instance keys
    const swapAll = (obj: Record<string, unknown>) => {
        for (const [prev, next] of Object.entries(instanceIds)) {
            swap(obj, prev, next)
        }
    }

    // Type is insurance for when I change node shape in the future and forget this exists
    const remapFn: Record<keyof NodePen.DocumentNode, () => void> = {
        instanceId: () => { },
        templateId: () => { },
        position: () => { },
        status: () => { },
        dimensions: () => { },
        anchors: () => swapAll(newInstance.anchors),
        sources: () => swapAll(newInstance.sources),
        values: () => swapAll(newInstance.values),
        // inputs: () => swapAll(newInstance.inputs),
        // outputs: () => swapAll(newInstance.outputs),
        inputs: () => { },
        outputs: () => { },
        nodeConfiguration: () => { },
        portConfigurations: () => swapAll(newInstance.portConfigurations)
    }

    for (const fn of Object.values(remapFn)) {
        fn()
    }

    return {
        instance: newInstance,
        instanceIds
    }
}