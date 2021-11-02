import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

type ModalLayoutProps = {
  children: JSX.Element
  onClose: () => void
}

export const ModalLayout = ({ children, onClose }: ModalLayoutProps): React.ReactElement => {
  // const { setZoomLock }
  return (
    <ModalPortal>
      <div
        className="relative w-full h-full "
        // onScroll={(e) => e.stopPropagation()}
      >
        <button
          className="absolute w-full h-full bg-dark opacity-50 left-0 top-0 z-10 pointer-events-auto"
          onClick={onClose}
        />
        <div className="absolute w-full h-full p-10 flex justify-center items-center left-0 top-0 z-20 pointer-events-none">
          <div
            className="w-full h-full flex flex-col p-4 bg-white rounded-md pointer-events-auto"
            style={{ maxWidth: '750px', maxHeight: '500px' }}
          >
            {children}
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

type ModalPortalProps = {
  children: JSX.Element
}

export const ModalPortal = ({ children }: ModalPortalProps): React.ReactElement => {
  const [container] = useState(() => {
    const el = document.createElement('div')

    el.style.zIndex = '999'
    el.style.position = 'absolute'
    el.style.left = '0'
    el.style.top = '0'
    el.style.width = '100vw'
    el.style.height = '100vh'
    el.style.paddingTop = '40px'

    return el
  })

  useEffect(() => {
    const target = document.getElementById('layout-root')

    if (!target) {
      return
    }

    target.appendChild(container)

    return () => {
      target.removeChild(container)
    }
  }, [container])

  return createPortal(children, container)
}
