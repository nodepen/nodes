import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { MenuAction } from 'features/graph/types'
import { OverlayPortal } from '../OverlayPortal'
import { OverlayContainer } from '../OverlayContainer'
import { useSetCameraPosition } from 'features/graph/hooks'
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { useCameraStaticPosition, useCameraStaticZoom } from 'features/graph/store/camera/hooks'
import { useGraphManager } from '@/context/graph'

type GenericMenuProps<T> = {
  context: T
  actions: MenuAction<T>[]
  position: [number, number]
  onClose: () => void
}

export const GenericMenu = <T,>({ context, actions, position, onClose }: GenericMenuProps<T>): React.ReactElement => {
  const r = 75

  const { registry } = useGraphManager()

  const [positions, setPositions] = useState<{ [key: number]: { dx: number; dy: number } }>({})

  const [overlayAnchorPosition, setOverlayAnchorPosition] = useState(() => position)

  const handlePanning = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      const { positionX, positionY } = ref.state

      const [anchorX, anchorY] = overlayAnchorPosition
      const [dx, dy] = [positionX - anchorX, positionY - anchorY]

      if (!registry.canvasContainerRef.current) {
        return
      }

      registry.canvasContainerRef.current.style.transform = `translate(${dx}px, ${dy}px)`
    },
    [registry.canvasContainerRef, overlayAnchorPosition]
  )

  const cameraPosition = useCameraStaticPosition()
  const cameraZoom = useCameraStaticZoom()
  const setCanvasCamera = useSetCameraPosition()

  const [initialOverlayPosition, setInitialOverlayPosition] = useState(() => position)
  const [initialCameraPosition, setInitialCameraPosition] = useState(() => cameraPosition)

  const handlePanningStop = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      const { positionX, positionY } = ref.state

      const [anchorX, anchorY] = initialOverlayPosition
      const [cameraX, cameraY] = initialCameraPosition

      const [dx, dy] = [positionX - anchorX, positionY - anchorY]

      setCanvasCamera(-cameraX - dx, -cameraY - dy, 'NONE', 0, 1, cameraZoom)

      setOverlayAnchorPosition([positionX, positionY])

      if (!registry.canvasContainerRef.current) {
        return
      }

      registry.canvasContainerRef.current.style.transform = `translate(0px, 0px)`
    },
    [registry.canvasContainerRef, initialCameraPosition, initialOverlayPosition, cameraZoom, setCanvasCamera]
  )

  useEffect(() => {
    setTimeout(() => {
      setPositions(
        actions.reduce((all, action) => {
          const { position } = action

          const radians = position * (Math.PI / 180)
          const [x, y] = [Math.cos(radians), Math.sin(radians)]

          return { ...all, [position]: { dx: x * (r + 12), dy: y * (r + 12) } }
        }, {})
      )

      setOverlayAnchorPosition(position)
      setInitialOverlayPosition(position)
      setInitialCameraPosition(cameraPosition)
    }, 0)
  }, [])

  const mask = useMemo(
    () => (
      <div
        className="absolute left-0 top-0 overflow-visible"
        style={{ width: 50, height: 50, transform: 'translate(-25px, -25px)' }}
      >
        <svg width="50" height="50" viewBox="0 0 10 10" className="overflow-visible">
          <mask id="donut">
            <circle cx="5" cy="5" r="500" fill="white" />
            <circle className="donut-inner" cx="5" cy="5" r={r / 5} fill="black" />
          </mask>
          <circle className="donut-outer" cx="5" cy="5" r="500" fill="#98E2C6" mask="url(#donut)" />
        </svg>
        <style jsx>{`
          @keyframes grow {
            from {
              transform: scale(0);
            }
          }

          @keyframes growr {
            from {
              r: 0;
            }
          }

          circle {
            transform-origin: 50% 50%;
          }

          .donut-inner {
            animation-name: grow;
            animation-duration: 200ms;
            animation-fill-mode: forwards;
            animation-timing-function: ease-in;
          }

          .donut-outer {
            animation-name: growr;
            animation-duration: 450ms;
            animation-fill-mode: forwards;
            animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
          }
        `}</style>
      </div>
    ),
    []
  )

  const [actionMenu, setActionMenu] = useState<JSX.Element>()
  const actionMenuRef = useRef<HTMLDivElement>(null)

  const generateActionMenu = (
    menu: JSX.Element,
    buttonId: string,
    buttonPosition: [number, number],
    side: 'left' | 'right'
  ): void => {
    const button = document.getElementById(buttonId)

    if (!button) {
      return
    }

    const [bx, by] = buttonPosition
    const { width } = button.getBoundingClientRect()
    const margin = 24

    const menuWidth = Math.min(window.innerWidth, 400)

    const x = side === 'right' ? bx + width + margin + 48 : bx - width - margin - menuWidth
    const y = by

    const menuContent = (
      <div className="absolute bg-red-400" style={{ width: menuWidth, left: x, top: y }} ref={actionMenuRef}>
        {menu}
      </div>
    )

    setActionMenu(menuContent)
  }

  useEffect(() => {
    if (!actionMenu) {
      return
    }

    if (!actionMenuRef.current) {
      return
    }

    const { left, top, width } = actionMenuRef.current.getBoundingClientRect()

    // console.log({ width })
  }, [actionMenu])

  return (
    <>
      <OverlayPortal>
        <OverlayContainer position={position} onPanning={handlePanning} onPanningStop={handlePanningStop}>
          <>
            {mask}
            {actionMenu}
            {actions.map((action, i) => {
              const { position, label, icon, menu, onClick } = action
              const { dx, dy } = positions?.[position] ?? { dx: 0, dy: 0 }

              const side: 'left' | 'right' = position < 90 || position > 270 ? 'right' : 'left'

              const id = `transient-action-${i}-${position}`

              return (
                <button
                  key={id}
                  id={id}
                  className="absolute action left-0 top-0 w-12 h-12 flex items-center justify-center rounded-full bg-pale border-2 border-green z-10 pointer-events-auto overflow-visible transition-transform duration-200 ease-in-out"
                  style={{ transform: `translate(${-24 + dx}px, ${-24 + dy}px)` }}
                  onClick={() => generateActionMenu(menu, `${id}-label`, [dx - 24, dy - 24], side)}
                >
                  <div className="relative w-full h-full">
                    <div className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center">{icon}</div>
                    <div
                      id={`${id}-label`}
                      style={side === 'left' ? { left: '-56px' } : { left: '54px' }}
                      className={`${
                        side === 'left' ? 'justify-end' : ''
                      } absolute top-0 h-12 flex items-center overflow-visible whitespace-nowrap`}
                    >
                      <p className="font-medium text-lg text-darkgreen" style={{ transform: 'translateY(-3px)' }}>
                        {label}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
            <button
              className="absolute w-8 h-8 appear-able border-2 border-swampgreen rounded-full flex items-center justify-center pointer-events-auto"
              style={{ left: -16, top: 125 }}
              onClick={onClose}
            >
              <svg width={12} height={12} viewBox="0 0 10 10">
                <line
                  x1={1}
                  y1={1}
                  x2={9}
                  y2={9}
                  fill="none"
                  stroke="#7BBFA5"
                  strokeWidth="2px"
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1={1}
                  y1={9}
                  x2={9}
                  y2={1}
                  fill="none"
                  stroke="#7BBFA5"
                  strokeWidth="2px"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </button>
          </>
        </OverlayContainer>
      </OverlayPortal>
      <style jsx>{`
        @keyframes appear {
          0% {
            opacity: 0;
          }
          75% {
            opacity: 0;
          }
          100% {
            opacity: 100;
          }
        }

        button {
          animation-name: appear;
          animation-duration: 200ms;
          animation-fill-mode: forwards;
          animation-timing-function: ease-in-out;
        }

        .appear-able {
          animation-name: appear;
          animation-duration: 200ms;
          animation-fill-mode: forwards;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </>
  )
}
