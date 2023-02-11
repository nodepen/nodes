
import type * as NodePen from '@nodepen/core'

export type ContextMenuContext =
    | PortContextMenuContext
    | RootContextMenuContext

export type PortContextMenuContext = {
    type: 'port'
    direction: 'input' | 'output'
    nodeInstanceId: string
    portInstanceId: string
    portTemplate: NodePen.PortTemplate
}

export type RootContextMenuContext = {
    type: 'root'
}