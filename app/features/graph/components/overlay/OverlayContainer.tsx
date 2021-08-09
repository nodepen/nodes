import React from 'react'
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'

type OverlayContainerProps = {
  children: JSX.Element
  /** Position is relative to parent, not page. (Currently content area excluding header.) */
  position: [left: number, top: number]
  static?: boolean
  pointerEvents?: boolean
  onInit?: (ref: ReactZoomPanPinchRef) => void
  onPanning?: (ref: ReactZoomPanPinchRef, e: TouchEvent | MouseEvent) => void
  onPanningStop?: (ref: ReactZoomPanPinchRef, e: TouchEvent | MouseEvent) => void
}

export const OverlayContainer = ({
  children,
  position,
  static: disabled = false,
  pointerEvents = true,
  onInit,
  onPanning,
  onPanningStop,
}: OverlayContainerProps): React.ReactElement => {
  const [left, top] = position

  return (
    <div className={`${pointerEvents ? 'pointer-events-auto' : 'pointer-events-none'} w-full h-full relative`}>
      <TransformWrapper
        disabled={disabled}
        initialScale={1}
        initialPositionX={left}
        initialPositionY={top}
        minScale={1}
        maxScale={1}
        limitToBounds={false}
        wheel={{
          disabled: true,
        }}
        pinch={{
          disabled: true,
        }}
        doubleClick={{
          disabled: true,
        }}
        onInit={onInit}
        onPanning={onPanning}
        onPanningStop={onPanningStop}
      >
        <TransformComponent>
          <div className="w-vw h-vh">
            <div className="w-full h-full relative">{children}</div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
