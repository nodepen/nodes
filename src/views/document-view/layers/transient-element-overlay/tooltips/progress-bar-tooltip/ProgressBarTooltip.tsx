import React from 'react'
import type { TooltipConfiguration, ProgressBarTooltipContext } from '../../types'
import { usePseudoShadow } from '@/views/common/pseudo-shadow'
import { useTooltip } from '../hooks'
import { COLORS } from '@/constants'
import { getViewIcon } from '@/utils/icons'

type ProgressBarTooltipProps = {
  tooltipKey: string
  configuration: TooltipConfiguration
  context: ProgressBarTooltipContext
}

const MAXIMUM_HEIGHT = 1000

export const ProgressBarTooltip = ({ tooltipKey, configuration, context }: ProgressBarTooltipProps) => {
  // This is the position of the *bottom left corner* of the parent div
  const { position } = configuration
  const { data } = context

  useTooltip(tooltipKey, configuration)

  const { x: left, y: bottom } = position

  const top = bottom - MAXIMUM_HEIGHT

  const tooltips = Object.values(data)
  tooltips.sort((a, b) => a.order - b.order)

  return (
    <div
      className="np-absolute np-w-48 np-flex np-flex-col np-justify-end"
      style={{ left, top, height: MAXIMUM_HEIGHT }}
    >
      {tooltips.map(({ viewKey, statusLevel, statusMessage }) => {
        const icon = getViewIcon(viewKey, COLORS.DARK)

        return (
          <ProgressBarTooltipEntry key={viewKey} icon={icon} statusLevel={statusLevel} statusMessage={statusMessage} />
        )
      })}
    </div>
  )
}

type ProgressBarTooltipEntryProps = {
  icon: React.ReactNode
  statusLevel: ProgressBarTooltipContext['data']['']['statusLevel']
  statusMessage: string
}

const ProgressBarTooltipEntry = ({ icon, statusLevel, statusMessage }: ProgressBarTooltipEntryProps) => {
  const shadowTarget = usePseudoShadow()

  const colors: Record<typeof statusLevel, string> = {
    normal: COLORS.GREEN,
    pending: COLORS.WARN,
    error: COLORS.ERROR,
  }

  return (
    <div className="np-w-48 np-mb-2 np-bg-light np-shadow-main np-rounded-md" ref={shadowTarget}>
      <div className="np-w-full np-flex np-justify-start np-items-start">
        <div className="np-w-8 np-h-8 np-flex np-justify-center np-items-center" style={{ minWidth: '2rem' }}>
          {icon}
        </div>
        <div className="np-w-4 np-h-8 np-mr-1 np-flex np-justify-center np-items-center" style={{ minWidth: '1rem' }}>
          <div className="np-w-3 np-h-3 np-rounded-full" style={{ backgroundColor: colors[statusLevel] }} />
        </div>
        <div className="np-pt-2 np-pb-2 np-pr-2 np-flex-grow np-flex np-flex-col np-justify-start">
          <p className="np-font-sans np-font-medium np-text-dark np-text-xs -np-translate-y-px np-select-none">
            {statusMessage}
          </p>
        </div>
      </div>
    </div>
  )
}
