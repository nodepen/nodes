import React from 'react'
import type { TooltipConfiguration, NodeTemplateSummaryTooltipContext } from '../../types'
import { usePseudoShadow } from '@/views/common/pseudo-shadow'
import { MenuSection } from '../../common'
import { getIconAsImage } from '@/utils/templates'
import { useTooltip } from '../hooks'

type NodeTemplateSummaryTooltipProps = {
  tooltipKey: string
  configuration: TooltipConfiguration
  context: NodeTemplateSummaryTooltipContext
}

export const NodeTemplateSummaryTooltip = ({ tooltipKey, configuration, context }: NodeTemplateSummaryTooltipProps) => {
  const { position } = configuration
  const { template } = context

  useTooltip(tooltipKey, configuration)

  const shadowTarget = usePseudoShadow()

  const { x: left, y: top } = position

  return (
    <div
      ref={shadowTarget}
      className="np-absolute np-w-48 np-p-1 np-flex np-flex-col np-bg-light np-shadow-main np-transition-all np-rounded-md"
      style={{ left, top }}
    >
      <MenuSection title={template.name} icon={<img src={getIconAsImage(template)} alt={template.name} />}>
        <p className="np-mt-1 np-mb-1 np-font-sans np-font-medium np-text-dark np-text-xs -np-translate-y-px">
          {template.description}
        </p>
      </MenuSection>
    </div>
  )
}
