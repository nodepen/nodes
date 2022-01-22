import React, { useEffect, useState } from 'react'
import nookies from 'nookies'
import { OverlayContainer } from '../OverlayContainer'
import { OverlayPortal } from '../OverlayPortal'
import { useSessionManager } from '@/features/common/context/session'
import { Typography } from '@/features/common'
import Link from 'next/link'

type LockedSolverMaskProps = {
  dx: number
}

export const LockedSolverMask = ({ dx }: LockedSolverMaskProps): React.ReactElement | null => {
  const { userRecord } = useSessionManager()

  const [showMask, setShowMask] = useState(false)
  const MASK_INSET = '8px'
  const MASK_INSET_INVERSE = `calc(100% - ${MASK_INSET})`

  useEffect(() => {
    const userIsExpected = !!nookies.get(undefined, { path: '/' }).token
    setShowMask(userIsExpected ? false : !userRecord)
  }, [userRecord])

  if (!showMask) {
    return null
  }

  return (
    <OverlayPortal>
      <>
        <OverlayContainer position={[dx, 48]} static pointerEvents={false}>
          <div
            className="w-full relative transition-transform duration-150 ease-out"
            style={{ height: 'calc(100% - 48px - 40px)', transform: `translateX(${dx}px)` }}
          >
            <div className="w-full h-full absolute top-0 left-0 locked-mask" />
            <div className="w-full h-full absolute">
              <div className="flex flex-col p-4">
                <div className="p-2 rounded-md flex items-center justify-start bg-pale pointer-events-auto">
                  <div
                    className="w-8 h-8 mr-2 flex justify-center items-center rounded-full"
                    style={{ minWidth: 32, minHeight: 32 }}
                  >
                    <svg className="w-6 h-6" fill="#093824" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-wrap items-center">
                    <p className="mr-2 text-sm font-medium text-darkgreen">
                      Solver is locked. Online solutions require a NodePen account.
                    </p>
                    <Link href="/signup">
                      <a className="p-2 pl-4 pr-4 rounded-md bg-green hover:bg-swampgreen text-sm font-semibold text-darkgreen ">
                        Sign up for free
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </OverlayContainer>
        <style jsx>{`
          .locked-mask {
            background: repeating-linear-gradient(-45deg, transparent, transparent 4px, #ff7171 4px, #ff7171 8px);
            clip-path: polygon(
              0% 0%,
              0% 100%,
              ${MASK_INSET} 100%,
              ${MASK_INSET} ${MASK_INSET},
              ${MASK_INSET_INVERSE} ${MASK_INSET},
              ${MASK_INSET_INVERSE} ${MASK_INSET_INVERSE},
              ${MASK_INSET} ${MASK_INSET_INVERSE},
              ${MASK_INSET} 100%,
              100% 100%,
              100% 0%
            );
          }
        `}</style>
      </>
    </OverlayPortal>
  )
}
