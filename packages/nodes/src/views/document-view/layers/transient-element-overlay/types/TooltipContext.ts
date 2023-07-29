import type * as NodePen from '@nodepen/core'

export type TooltipContext = NodeTemplateSummaryTooltipContext | PortTooltipContext | ProgressBarTooltipContext

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
