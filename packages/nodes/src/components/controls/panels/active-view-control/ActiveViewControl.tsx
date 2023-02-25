import React, { useEffect } from 'react'
import { ControlPanel } from '../../common'
import { useStore, useDispatch } from '$'
import { clamp } from '@/utils'
import { useActiveViewPosition, useViewPosition } from '@/views/common/hooks'
import { COLORS } from '@/constants'

export const ActiveViewControl = (): React.ReactElement => {
  const { apply } = useDispatch()

  const registeredViews = useStore((store) => Object.keys(store.registry.views))

  return (
    <div className='np-w-full np-grid np-grid-cols-[min-content_1fr] np-gap-3'>
      <ControlPanel disablePadding>
        <div className='np-h-10 np-w-14 np-p-1 np-flex np-items-center np-justify-center'>
          <button className='np-w-8 np-h-8 np-flex np-items-center np-justify-center np-rounded-sm hover:np-bg-swampgreen'>
            <svg width={20} aria-hidden="true" fill="none" stroke={COLORS.DARKGREEN} strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect={"non-scaling-stroke"} />
            </svg>
          </button>
        </div>
      </ControlPanel>
      <ControlPanel disablePadding>
        <ActiveViewTabs />
      </ControlPanel>
    </div>
  )
}

const ActiveViewTabs = () => {
  const { apply } = useDispatch()

  const registeredViewKeys = useStore((state) => Object.keys(state.registry.views))
  const activeViewPosition = useActiveViewPosition()

  return (
    <div className='np-w-full np-h-full np-relative'>
      <div className='np-absolute np-w-full np-h-full np-p-1 np-left-0 np-top-0 np-z-0'>
        <div
          className='np-w-8 np-h-8 np-rounded-sm np-bg-swampgreen'
          style={{
            transition: 'transform',
            transitionDuration: '300ms',
            transitionTimingFunction: 'ease-out',
            transform: `translateX(${clamp(activeViewPosition, 0, 10) * (32 + 4)}px)`
          }}
        />
      </div>
      <div className='np-absolute np-w-full np-h-full np-p-1 np-left-0 np-top-0 np-z-10'>
        <div className='np-w-full np-h-full np-flex np-justify-start np-items-center'>
          {registeredViewKeys.map((viewKey) => (
            <button
              key={`navigation-tab-button-${viewKey}`}
              className='np-w-8 np-h-8 np-mr-1 last:np-mr-0 np-pointer-events-auto np-flex np-items-center np-justify-center'
              onClick={() => {
                apply((state) => {
                  state.layout.activeView = viewKey
                })
              }}
            >
              O
            </button>
          ))}
        </div>
      </div>
    </div>
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
