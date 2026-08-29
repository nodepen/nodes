import type * as NodePen from '@/types'

export type ContextMenuContext =
    | AddNodeContextMenu
    | DocumentContextMenuContext
    | CanvasContextMenuContext
    | NodeContextMenuContext
    | PortContextMenuContext
    | PortValueContextMenuContext
    | PortLabelContextMenuContext
    | NumberSliderValueContextMenuContext
    | ValueListContextMenuContext
    | ValueListOptionsContextMenuContext
    | ColorSwatchContextMenuContext
    | ColorParameterContextMenuContext
    | GradientContextMenuContext

export type AddNodeContextMenu = {
    type: 'add-node'
}

export type DocumentContextMenuContext = {
    type: 'document'
}

export type CanvasContextMenuContext = {
    type: 'canvas'
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

export type ValueListContextMenuContext = {
    type: 'value-list'
    nodeInstanceId: string
}

export type ValueListOptionsContextMenuContext = {
    type: 'value-list-options'
    nodeInstanceId: string
}

export type ColorSwatchContextMenuContext = {
    type: 'color-swatch'
    nodeInstanceId: string
}

export type ColorParameterContextMenuContext = {
    type: 'color-parameter'
    nodeInstanceId: string
    portInstanceId: string
}

export type GradientContextMenuContext = {
    type: 'gradient'
    nodeInstanceId: string
}