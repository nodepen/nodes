import type * as NodePen from '@/types'

export type ContextMenuContext =
    | AddNodeContextMenu
    | DocumentContextMenuContext
    | NodeContextMenuContext
    | PortContextMenuContext
    | PortValueContextMenuContext
    | PortLabelContextMenuContext
    | NumberSliderValueContextMenuContext

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

export type PortLabelContextMenuContext = {
    type: 'port-label',
    nodeInstanceId: string
    portInstanceId: string
}

export type NumberSliderValueContextMenuContext = {
    type: 'number-slider-value'
    nodeInstanceId: string
}