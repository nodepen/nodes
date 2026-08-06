import type * as NodePen from '@/types'

export const getPortDirection = (node: NodePen.DocumentNode, portInstanceId: string): 'input' | 'output' => {
    if (Object.keys(node.inputs).includes(portInstanceId) || portInstanceId === 'input') {
        return 'input'
    }
    if (Object.keys(node.outputs).includes(portInstanceId) || portInstanceId === 'output') {
        return 'output'
    }
    throw new Error(`🐍 Could not find port [${portInstanceId}] on node [${node.instanceId}] !`)
}