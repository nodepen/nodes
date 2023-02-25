import React from 'react'
import { ControlPanel } from '../../common'
import { useStore, useDispatch } from '$'
import { clamp } from '@/utils'
import { useActiveViewPosition } from '@/views/common/hooks'
import { COLORS } from '@/constants'

export const ActiveViewControl = (): React.ReactElement => {
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
              className='np-w-8 np-h-8 np-mr-1 last:np-mr-0 np-pointer-events-auto np-flex np-items-center np-justify-center hover:np-border-b-2 hover:np-border-b-swampgreen'
              onClick={() => {
                apply((state) => {
                  state.layout.activeView = viewKey
                })
              }}
            >
              {getViewIcon(viewKey)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// TODO: Allow views to register their own icon
const getViewIcon = (viewKey: string) => {
  switch (viewKey) {
    case 'document': {
      return (
        <svg width={20} aria-hidden="true" fill={COLORS.DARKGREEN} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
          <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
        </svg>
      )
    }
    case 'speckle-viewer': {
      return (
        <svg width={20} aria-hidden="true" fill={COLORS.DARKGREEN} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
        </svg>
      )
    }
    default: {
      return <></>
    }
  }
}