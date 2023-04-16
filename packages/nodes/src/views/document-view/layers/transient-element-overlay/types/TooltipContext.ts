import type * as NodePen from '@nodepen/core'

export type TooltipContext = NodeTemplateSummaryTooltipContext

export type NodeTemplateSummaryTooltipContext = {
  type: 'node-template-summary'
  template: NodePen.NodeTemplate
}
