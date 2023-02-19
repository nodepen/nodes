
import type * as NodePen from '@nodepen/core'

export type ContextMenuContext =
    | NodeContextMenuContext
    | PortContextMenuContext
    | DocumentContextMenuContext

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

export type DocumentContextMenuContext = {
    type: 'document'
}