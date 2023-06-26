import React from 'react'
import type { TooltipConfiguration, PortTooltipContext } from '../../types'
import { usePseudoShadow } from '@/views/common/pseudo-shadow'
import { MenuSection } from '../../common'
import { useTooltip } from '../hooks'
import { PortTypeIcon } from '@/components/icons'
import { usePortValues } from '@/hooks'
import { COLORS } from '@/constants'

type PortTooltipProps = {
  tooltipKey: string
  configuration: TooltipConfiguration
  context: PortTooltipContext
}

export const PortTooltip = ({ tooltipKey, configuration, context }: PortTooltipProps) => {
  const { position } = configuration
  const { template, nodeInstanceId, portInstanceId } = context

  useTooltip(tooltipKey, configuration)

  const shadowTarget = usePseudoShadow()

  const { x: left, y: top } = position

  const values = usePortValues(nodeInstanceId, portInstanceId)

  const dataIcon = (
    <svg
      aria-hidden="true"
      fill="none"
      stroke={COLORS.DARK}
      strokeWidth={2.5}
      vectorEffect="non-scaling-stroke"
      viewBox="0 0 24 24"
      width={18}
      height={18}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  console.log(values)

  return (
    <div
      ref={shadowTarget}
      className="np-absolute np-w-48 np-p-1 np-flex np-flex-col np-bg-light np-shadow-main np-transition-all np-rounded-md"
      style={{ left, top }}
    >
      <MenuSection title={template.name} icon={<PortTypeIcon />}>
        <p className="np-mt-1 np-mb-2 np-font-sans np-font-medium np-text-dark np-text-xs -np-translate-y-px">
          {template.description}
        </p>
      </MenuSection>
      <MenuSection title={'4 values'} icon={dataIcon} border>
        <p className="np-mt-1 np-mb-2 np-font-sans np-font-medius np-text-dark np-text-xs">1 list of 24 values</p>
        <div className="np-w-full np-h-16 np-rounded-sm np-bg-grey" />
      </MenuSection>
    </div>
  )
}
