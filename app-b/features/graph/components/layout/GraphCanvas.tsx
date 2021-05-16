import React from 'react'
import { useCameraDispatch } from '../../store/hooks'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Container } from '../elements'

const GraphCanvas = (): React.ReactElement => {
  const { setZoom, setPosition } = useCameraDispatch()

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      onContextMenu={(e) => {
        e.preventDefault()
      }}
      onMouseDown={(e) => {
        switch (e.button) {
          case 2:
            return
          default:
            e.stopPropagation()
        }
      }}
      role="presentation"
    >
      <TransformWrapper
        defaultScale={1}
        defaultPositionX={0}
        defaultPositionY={0}
        options={{ limitToWrapper: false, limitToBounds: false, centerContent: false, minScale: 0.25, maxScale: 2.5 }}
        onPanning={(x: any) => {
          setPosition([x.positionX, x.positionY])
        }}
        onZoomChange={(zoom: any) => {
          setZoom(zoom.scale)
          setPosition([zoom.positionX, zoom.positionY])
        }}
        pinch={{ step: 100 }}
        wheel={{ step: 100 }}
        scalePadding={{ disabled: true }}
        pan={{ velocity: false }}
      >
        <TransformComponent>
          <div className="w-vw h-vh">
            <Container />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default React.memo(GraphCanvas)
