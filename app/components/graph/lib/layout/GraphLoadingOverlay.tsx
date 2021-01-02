import React, { useState } from 'react'
import { Transition } from '@headlessui/react'
import { useGraphManager } from '@/context/graph'

type GraphLoadingOverlayProps = {
  children?: React.ReactNode
}

export const GraphLoadingOverlay = ({ children }: GraphLoadingOverlayProps): React.ReactElement => {
  const { ready } = useGraphManager()

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
      <div className="absolute left-0 top-0 w-full h-full z-0">
        {children}
      </div>
    </div>
  )
}