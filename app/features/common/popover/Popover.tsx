import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type PopoverProps = {
  position: [left: number, top: number]
  anchor: 'TL' | 'TR'
  children: JSX.Element
}

export const Popover = ({ position, anchor, children }: PopoverProps): React.ReactElement => {
  const [left, top] = position

  return (
    <PopoverPortal>
      <div className="w-full h-full relative pointer-events-none">
        <div
          className="absolute"
          style={{ left: anchor === 'TL' ? left : 0, top, width: anchor === 'TL' ? undefined : left }}
        >
          <div className={`${anchor === 'TL' ? 'justify-start' : 'justify-end'} w-full flex items-start`}>
            {children}
          </div>
        </div>
      </div>
    </PopoverPortal>
  )
}

type PopoverPortalProps = {
  children: JSX.Element
}

export const PopoverPortal = ({ children }: PopoverPortalProps): React.ReactElement => {
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
    document.appendChild(container)

    return () => {
      document.removeChild(container)
    }
  }, [container])

  return createPortal(children, container)
}
