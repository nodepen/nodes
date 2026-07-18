import type * as NodePen from '@/types'

export type TooltipContext =
    | NodeTemplateSummaryTooltipContext
    | PortTooltipContext
    | ProgressBarTooltipContext
    | GenericTextTooltipContext

export type NodeTemplateSummaryTooltipContext = {
    type: 'node-template-summary'
    template: NodePen.NodeTemplate
}

export type PortTooltipContext = {
    type: 'port'
    template: NodePen.PortTemplate
    nodeInstanceId: string
    portInstanceId: string
}

export type ProgressBarTooltipContext = {
    type: 'progress-bar'
    data: {
        [viewKey: string]: {
            order: number
            viewKey: 'document' | 'model'
            statusLevel: 'normal' | 'pending' | 'error'
            statusMessage: string
        }
    }
}

export type GenericTextTooltipContext = {
    type: 'generic-text'
    textContent: string
    hotkeys?: string[]
}
