import React from 'react'
import type { TooltipConfiguration, NodeTemplateSummaryTooltipContext } from '../types'
import { usePseudoShadow } from '@/views/common/pseudo-shadow'

type NodeTemplateSummaryTooltipProps = {
  configuration: TooltipConfiguration
  context: NodeTemplateSummaryTooltipContext
}

export const NodeTemplateSummaryTooltip = ({ configuration, context }: NodeTemplateSummaryTooltipProps) => {
  const { position, isSticky } = configuration
  const { template } = context

  const shadowTarget = usePseudoShadow()

  const { x: left, y: top } = position

  return (
    <div
      ref={shadowTarget}
      className="np-absolute np-h-8 np-bg-light np-shadow-main np-transition-all np-rounded-md"
      style={{ left, top }}
    >
      <p>{template.name}</p>
    </div>
  )
}
