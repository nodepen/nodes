import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type PopoverProps = {
  position: [left: number, top: number]
  anchor: 'TL' | 'TR'
  onClose: () => void
  children: JSX.Element
}

export const Popover = ({ position, anchor, onClose, children }: PopoverProps): React.ReactElement => {
  const [left, top] = position

  return (
    <PopoverPortal>
      <>
        <div
          className="w-full h-full relative pointer-events-auto"
          id="popover-container"
          onPointerDownCapture={(e) => {
            if ((e.target as Element).id === 'popover-container') {
              onClose()
            }
          }}
        >
          <div
            className="absolute"
            style={{ left: anchor === 'TL' ? left : 0, top, width: anchor === 'TL' ? undefined : left }}
          >
            <div className={`${anchor === 'TL' ? 'justify-start' : 'justify-end'} w-full flex items-start dropper`}>
              {children}
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes drop-in {
            from {
              transform: translateY(-150%);
            }
            to {
              transform: translateY(0%);
            }
          }

          .dropper {
            animation-name: drop-in;
            animation-duration: 250ms;
            animation-timing-function: ease-out;
            animation-fill-mode: forwards;
          }
        `}</style>
      </>
    </PopoverPortal>
  )
}

type PopoverPortalProps = {
  children: JSX.Element
}

const PopoverPortal = ({ children }: PopoverPortalProps): React.ReactElement => {
  const [container] = useState(() => {
    const el = document.createElement('div')

    el.style.zIndex = '999'
    el.style.position = 'absolute'
    el.style.left = '0'
    el.style.top = '0'
    el.style.width = '100vw'
    el.style.height = '100vh'
    el.style.pointerEvents = 'none'
    el.style.overflow = 'hidden'

    return el
  })

  useEffect(() => {
    const parent = document.getElementById('layout-root')

    if (!parent) {
      return
    }

    parent.appendChild(container)

    return () => {
      parent.removeChild(container)
    }
  }, [container])

  return createPortal(children, container)
}
