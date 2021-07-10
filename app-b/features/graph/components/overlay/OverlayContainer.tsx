import React from 'react'
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'

type OverlayContainerProps = {
  children: JSX.Element
  position: [left: number, top: number]
  onInit?: (ref: ReactZoomPanPinchRef) => void
  onPanning?: (ref: ReactZoomPanPinchRef, e: TouchEvent | MouseEvent) => void
  onPanningStop?: (ref: ReactZoomPanPinchRef, e: TouchEvent | MouseEvent) => void
}

export const OverlayContainer = ({
  children,
  position,
  onInit,
  onPanning,
  onPanningStop,
}: OverlayContainerProps): React.ReactElement => {
  const [left, top] = position

  return (
    <div className="w-full h-full relative pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
      <TransformWrapper
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
