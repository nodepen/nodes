import type * as NodePen from '@nodepen/core'

export type TooltipContext = NodeTemplateSummaryTooltipContext | PortTooltipContext

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
