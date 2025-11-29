import React from 'react'
import { useStore } from '$'
import { AddNodeContextMenu, NodeContextMenu, PortContextMenu } from './context-menus'
import { CursorContainer } from './cursors'
import { getMenuHeight } from './utils'
import { useReducedMotion } from '@/hooks'
import { NodeTemplateSummaryTooltip, PortTooltip } from './tooltips'
import { useCursorState } from './cursors/hooks'
import { ProgressBarTooltip } from './tooltips/progress-bar-tooltip'

const TransientElementOverlay = () => {
  const cursor = useCursorState()
  const menus = useStore((state) => Object.entries(state.registry.contextMenus))
  const tooltips = useStore((state) => Object.entries(state.registry.tooltips))

  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="np-w-full np-h-full np-pointer-events-none np-relative">
      <CursorContainer cursor={cursor} />
      {tooltips.map(([key, tooltip]) => {
        const contextType = tooltip.context.type

        switch (contextType) {
          case 'node-template-summary': {
            return (
              <NodeTemplateSummaryTooltip
                key={`node-template-summary-tooltip`}
                tooltipKey={key}
                configuration={tooltip.configuration}
                context={tooltip.context}
              />
            )
          }
          case 'port': {
            return (
              <PortTooltip
                key={`port-tooltip`}
                tooltipKey={key}
                configuration={tooltip.configuration}
                context={tooltip.context}
              />
            )
          }
          case 'progress-bar': {
            return (
              <ProgressBarTooltip
                key="progress-bar-tooltip"
                tooltipKey={key}
                configuration={tooltip.configuration}
                context={tooltip.context}
              />
            )
          }
          default: {
            console.log(`🐍 Unhandled tooltip type [${contextType}]`)
            return null
          }
        }
      })}
      {menus.map(([key, menu]) => {
        const contextType = menu.context.type

        if (!prefersReducedMotion) {
          const menuHeight = getMenuHeight(menu.context)
          document.documentElement.style.setProperty('--np-active-menu-height', `${menuHeight}px`)
        }

        switch (contextType) {
          case 'add-node': {
            return <AddNodeContextMenu key={`add-node-menu`} position={menu.position} />
          }
          case 'document': {
            return null
          }
          case 'node': {
            return <NodeContextMenu key={`node-context-menu-${key}`} position={menu.position} context={menu.context} />
          }
          case 'port': {
            return <PortContextMenu key={`node-context-menu-${key}`} position={menu.position} context={menu.context} />
          }
          default: {
            console.log(`🐍 Unhandled context menu type [${contextType}]`)
            return null
          }
        }
      })}
    </div>
  )
}

export default React.memo(TransientElementOverlay)
