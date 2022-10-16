import React from 'react'
import { ControlPanel } from '../common'
import { useDispatch } from '$'
import { useActiveViewTransform } from '@/hooks'
import { COLORS } from '@/constants'

export const ActiveViewControl = (): React.ReactElement => {
  const { apply } = useDispatch()

  const tabs: ('graph' | 'model')[] = ['graph', 'model']

  return (
    <ControlPanel>
      <div className="np-w-full np-h-4 np-relative np-overflow-hidden">
        {tabs.map((tab) => (
          <ActiveViewLabel tab={tab} />
        ))}
        <div
          className="np-w-3 np-h-4 np-absolute np-flex np-justify-center np-items-center hover:np-cursor-pointer"
          style={{ left: 0, top: 0, zIndex: 20 }}
          onClick={() =>
            apply((state) => {
              if (state.layout.tabs.current === 'model') {
                state.layout.tabs.current = 'graph'
                return
              }
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
          className="np-w-3 np-h-4 np-absolute np-flex np-justify-center np-items-center hover:np-cursor-pointer"
          style={{ right: 0, top: 0, zIndex: 20 }}
          onClick={() =>
            apply((state) => {
              if (state.layout.tabs.current === 'graph') {
                state.layout.tabs.current = 'model'
                return
              }
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
  tab: 'graph' | 'model'
}

const ActiveViewLabel = ({ tab }: ActiveViewLabelProps): React.ReactElement => {
  const activeTabDelta = useActiveViewTransform(tab)

  const label = tab === 'graph' ? 'Document' : 'Model'

  return (
    <div
      className="np-w-full np-h-full np-absolute np-flex np-justify-center np-items-center"
      style={{
        zIndex: 10,
        transition: 'transform',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        transform: `translateX(${activeTabDelta * 100}%)`,
      }}
    >
      <h2 className="np-font-sans np-text-md np-text-darkgreen">{label}</h2>
    </div>
  )
}
