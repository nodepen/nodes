import React from 'react'
import type { TooltipConfiguration, NodeTemplateSummaryTooltipContext } from '../types'
import { usePseudoShadow } from '@/views/common/pseudo-shadow'
import { MenuSection } from '../common'
import { COLORS } from '@/constants'

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
      className="np-absolute np-w-48 np-p-1 np-flex np-flex-col np-bg-light np-shadow-main np-transition-all np-rounded-md"
      style={{ left, top }}
    >
      <MenuSection>{template.name}</MenuSection>
      <MenuSection>{template.description}</MenuSection>
      {/* <MenuSection background={`${'#'}${COLORS.GREY}`}>2456 items</MenuSection> */}
    </div>
  )
}
