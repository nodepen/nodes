import type * as NodePen from '@/types'

export type ContextMenuContext =
  | AddNodeContextMenu
  | DocumentContextMenuContext
  | NodeContextMenuContext
  | PortContextMenuContext
  | PortValueContextMenuContext

export type AddNodeContextMenu = {
  type: 'add-node'
}

export type DocumentContextMenuContext = {
  type: 'document'
}

export type NodeContextMenuContext = {
  type: 'node'
  nodeInstanceId: string
  nodeTemplate: NodePen.NodeTemplate
}

export type PortContextMenuContext = {
  type: 'port'
  direction: 'input' | 'output'
  nodeInstanceId: string
  portInstanceId: string
  portTemplate: NodePen.PortTemplate
}

export type PortValueContextMenuContext = {
  type: 'port-value',
  valueType: string
  nodeInstanceId: string
  portInstanceId: string
}
