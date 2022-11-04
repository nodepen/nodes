import React, { useEffect } from 'react'
import { ControlPanel } from '../../common'
import { useStore, useDispatch } from '$'
import { clamp } from '@/utils'
import { useViewPosition } from '@/views/common/hooks'
import { COLORS } from '@/constants'

export const ActiveViewControl = (): React.ReactElement => {
  const { apply } = useDispatch()

  const registeredViews = useStore((store) => Object.keys(store.registry.views))

  return (
    <ControlPanel>
      <div className="np-w-full np-h-4 np-relative np-overflow-hidden">
        {registeredViews.map((viewKey) => (
          <ActiveViewLabel key={`view-control-tab-${viewKey}`} viewKey={viewKey} />
        ))}
        <div
          className="np-w-3 np-h-4 np-absolute np-flex np-justify-center np-items-center hover:np-cursor-pointer np-bg-green"
          style={{ left: 0, top: 0, zIndex: 20 }}
          onClick={() =>
            apply((state) => {
              const viewCount = Object.keys(state.registry.views).length
              const activeView = state.layout.activeView

              if (!activeView) {
                return
              }

              const activeViewConfiguration = state.registry.views[activeView]

              if (!activeViewConfiguration) {
                return
              }

              const nextViewPosition = clamp(activeViewConfiguration.order - 1, 0, viewCount - 1)
              const nextViewKey = Object.entries(state.registry.views).find(
                ([_key, config]) => config.order === nextViewPosition
              )?.[0]

              if (!nextViewKey) {
                return
              }

              state.layout.activeView = nextViewKey
            })
          }
        >
          <svg width={4} height={8} viewBox="0 0 5 10" className="np-overflow-visible">
            <polyline
              points="5,0 0,5 5,10"
              fill="none"
              stroke={COLORS.DARKGREEN}
              strokeWidth="2px"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div
          className="np-w-3 np-h-4 np-absolute np-flex np-justify-center np-items-center hover:np-cursor-pointer np-bg-green"
          style={{ right: 0, top: 0, zIndex: 20 }}
          onClick={() =>
            apply((state) => {
              const viewCount = Object.keys(state.registry.views).length
              const activeView = state.layout.activeView

              if (!activeView) {
                return
              }

              const activeViewConfiguration = state.registry.views[activeView]

              if (!activeViewConfiguration) {
                return
              }

              const nextViewPosition = clamp(activeViewConfiguration.order + 1, 0, viewCount - 1)
              const nextViewKey = Object.entries(state.registry.views).find(
                ([_key, config]) => config.order === nextViewPosition
              )?.[0]

              if (!nextViewKey) {
                return
              }

              state.layout.activeView = nextViewKey
            })
          }
        >
          <svg width={4} height={8} viewBox="0 0 5 10" className="np-overflow-visible">
            <polyline
              points="0,0 5,5 0,10"
              fill="none"
              stroke={COLORS.DARKGREEN}
              strokeWidth="2px"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </ControlPanel>
  )
}

type ActiveViewLabelProps = {
  viewKey: string
}

const ActiveViewLabel = ({ viewKey }: ActiveViewLabelProps): React.ReactElement | null => {
  const viewLabel = useStore((store) => store.registry.views[viewKey]?.label)
  const viewPosition = useViewPosition(viewKey)

  if (!viewLabel || viewPosition === null) {
    return null
  }

  return (
    <div
      className="np-w-full np-h-full np-absolute np-flex np-justify-center np-items-center"
      style={{
        zIndex: 10,
        transition: 'transform',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        transform: `translateX(${viewPosition * 100}%)`,
      }}
    >
      <h2 className="np-font-sans np-text-md np-text-darkgreen">{viewLabel}</h2>
    </div>
  )
}
