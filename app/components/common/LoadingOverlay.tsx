import React from 'react'
import { Transition } from '@headlessui/react'
import { useGraphManager } from '@/context/graph'

type LoadingOverlayProps = {
  children?: React.ReactNode
}

export const LoadingOverlay = ({ children }: LoadingOverlayProps): React.ReactElement => {
  const {
    store: { ready },
  } = useGraphManager()

  const d = 'M 0 12.5 Q 12.5 0 25 12.5 Q 37.5 25 50 12.5'

  return (
    <div className="relative w-full h-full">
      <Transition
        show={!ready}
        leave="transition-transform ease-in duration-1000 transform"
        leaveFrom="scale-100"
        leaveTo="scale-1000"
      >
        {(ref) => (
          <div ref={ref} className="absolute left-0 top-0 w-full h-full z-10">
            <svg viewBox="0 0 200 200" width="100%" height="100%" className="overflow-visible">
              <defs>
                <mask id="hole">
                  <circle cx="100" cy="100" r="300" clipRule="evenodd" fill="white" />
                  <circle cx="100" cy="100" r="50" className={`${!ready ? 'animate-swell' : ''}`} fill="black" />
                </mask>
              </defs>
              <circle cx="100" cy="100" r="1000" fill="#98E2C6" mask="url(#hole)" />
            </svg>
          </div>
        )}
      </Transition>
      <Transition show={!ready} leave="transition ease duration-500" leaveFrom="opacity-100" leaveTo="opacity-0">
        {(ref) => (
          <div ref={ref} className="absolute left-0 top-0 w-full h-full z-20 flex flex-col justify-center items-center">
            <h2 className="font-display text-2xl font-medium">{ready ? '👉😎👉' : 'loading'}</h2>
            <svg width="150" height="25" viewBox="0 0 150 25">
              <g className="animate-scroll">
                {[...Array(8)].map((e, i) => (
                  <path
                    d={d}
                    key={`loading-squiggle-${i}`}
                    fill="none"
                    stroke="#98E2C6"
                    strokeWidth="0.7mm"
                    style={{ transform: `translateX(${i * 50}px)` }}
                  />
                ))}
              </g>
            </svg>
          </div>
        )}
      </Transition>
      <div className="absolute left-0 top-0 w-full h-full z-0">{children}</div>
    </div>
  )
}
