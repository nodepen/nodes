import React from 'react'
import type { TooltipConfiguration, PortTooltipContext } from '../../types'
import { usePseudoShadow } from '@/views/common/pseudo-shadow'
import { MenuSection } from '../../common'
import { useTooltip } from '../hooks'
import { PortTypeIcon } from '@/components/icons'

type PortTooltipProps = {
  tooltipKey: string
  configuration: TooltipConfiguration
  context: PortTooltipContext
}

export const PortTooltip = ({ tooltipKey, configuration, context }: PortTooltipProps) => {
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
      <MenuSection title={template.name} icon={<PortTypeIcon />} />
      <MenuSection>
        <p className="np-mb-1 np-font-sans np-font-medium np-text-dark np-text-xs -np-translate-y-px">
          {template.description}
        </p>
      </MenuSection>
    </div>
  )
}
