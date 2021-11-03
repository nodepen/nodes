import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

type ModalLayoutProps = {
  children: JSX.Element
  onClose: () => void
}

export const ModalLayout = ({ children, onClose }: ModalLayoutProps): React.ReactElement => {
  // const { setZoomLock }
  return (
    <>
      <ModalPortal>
        <div
          className="w-full h-full overflow-hidden"
          // onScroll={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full animate-appear">
            <button
              className="absolute w-full h-full left-0 top-0 animate-modal z-10 pointer-events-auto bg-none"
              style={{
                backgroundSize: `15mm 15mm`,
                backgroundImage: `linear-gradient(to right, #98e2c6 5mm, transparent 1px, transparent 10px), linear-gradient(to bottom, #98e2c6 5mm, transparent 1px, transparent 10px)`,
              }}
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
        </div>
      </ModalPortal>
      <style jsx>{`
        @keyframes march {
          from {
            background-position: left bottom;
          }
          to {
            background-position: right top;
          }
        }

        .animate-modal {
          animation-name: march;
          animation-duration: 120s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes appear {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-appear {
          animation-name: appear;
          animation-duration: 300ms;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </>
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
