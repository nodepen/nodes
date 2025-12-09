import type * as NodePen from '@/types'

export const getPortDirection = (node: NodePen.DocumentNode, portInstanceId: string): 'input' | 'output' => {
  if (Object.keys(node.inputs).includes(portInstanceId)) {
    return 'input'
  }
  if (Object.keys(node.outputs).includes(portInstanceId)) {
    return 'output'
  }
  throw new Error(`🐍 Could not find port [${portInstanceId}] on node [${node.instanceId}] !`)
}