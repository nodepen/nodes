import React, { useEffect, useState } from 'react'
import nookies from 'nookies'
import { OverlayContainer } from '../OverlayContainer'
import { OverlayPortal } from '../OverlayPortal'
import { useSessionManager } from '@/features/common/context/session'

export const LockedSolverMask = (): React.ReactElement | null => {
  const { userRecord } = useSessionManager()

  const [showMask, setShowMask] = useState(false)
  const MASK_INSET = '8px'
  const MASK_INSET_INVERSE = `calc(100% - ${MASK_INSET})`

  useEffect(() => {
    const userIsExpected = !!nookies.get(undefined, 'token').token
    setShowMask(userIsExpected ? false : !userRecord)
  }, [userRecord])

  if (!showMask) {
    return null
  }

  return (
    <OverlayPortal>
      <>
        <OverlayContainer position={[0, 48]} static pointerEvents={false}>
          <div className="w-full relative" style={{ height: 'calc(100% - 48px - 40px)' }}>
            <div className="w-full h-full absolute top-0 left-0 locked-mask" />
            <div className="w-full h-full absolute">
              <div className="w-full h-full flex flex-col p-4">Howdy</div>
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
