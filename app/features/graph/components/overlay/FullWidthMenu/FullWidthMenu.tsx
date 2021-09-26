import React, { useEffect, useState } from 'react'
import { useOverlayOffset } from '../hooks'
import { OverlayContainer } from '../OverlayContainer'
import { OverlayPortal } from '../OverlayPortal'

type FullWidthMenuProps = {
  children: JSX.Element
  /**
   * The position (in screen space) the appearance animation should start from.
   */
  start: [x: number, y: number]
}

const FullWidthMenu = ({ children, start }: FullWidthMenuProps): React.ReactElement => {
  const [x, y] = useOverlayOffset(start)

  const [diagonal, setDiagonal] = useState(0)

  useEffect(() => {
    const { innerWidth: w, innerHeight: h } = window

    const d = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2))

    setDiagonal(d * 0.75)
  }, [])

  return (
    <OverlayPortal>
      <>
        <OverlayContainer position={[0, 0]} static>
          <div
            className="w-full bg-green overflow-auto container"
            style={{
              height: 'calc(100vh - 40px)',
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </OverlayContainer>
        <style jsx>{`
          @keyframes fullwidthappear {
            from {
              clip-path: circle(0px at ${x}px ${y}px);
            }
            to {
              clip-path: circle(${diagonal}px at ${x}px ${y}px);
            }
          }

          .container {
            animation-name: fullwidthappear;
            animation-duration: 300ms;
            animation-timing-function: ease-out;
            animation-fill-mode: forwards;
          }
        `}</style>
      </>
    </OverlayPortal>
  )
}

export default React.memo(FullWidthMenu)
