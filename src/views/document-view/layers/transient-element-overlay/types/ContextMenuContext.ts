import type * as NodePen from '@nodepen/core'

export type ContextMenuContext =
  | AddNodeContextMenu
  | DocumentContextMenuContext
  | NodeContextMenuContext
  | PortContextMenuContext

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
