import React, { useEffect, useRef } from 'react'
import { useCameraDispatch, useCameraZoomLock } from '../../store/hooks'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Container } from '../canvas'
import { useGraphManager } from '@/context/graph'

const GraphCanvas = (): React.ReactElement => {
  const { register } = useGraphManager()

  const { setMode, setLiveZoom, setStaticZoom, setLivePosition, setStaticPosition } = useCameraDispatch()
  const zoomDisabled = useCameraZoomLock()

  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    register.setTransform((canvasRef.current as any).context.dispatch.setTransform)
  }, [])

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
        onPanning={(e: any) => {
          setLivePosition([e.positionX, e.positionY])
        }}
        onPanningStop={(e: any) => {
          setStaticPosition([e.positionX, e.positionY])
        }}
        onZoomChange={(zoom: any) => {
          setLiveZoom(zoom.scale)
          setLivePosition([zoom.positionX, zoom.positionY])
        }}
        onWheelStart={() => {
          setMode('zooming')
        }}
        onWheelStop={(e: any) => {
          setMode('idle')
          setStaticZoom(e.scale)
          setStaticPosition([e.positionX, e.positionY])
          console.log({ e })
        }}
        onPinchingStart={() => {
          setMode('zooming')
        }}
        onPinchingStop={(e: any) => {
          setMode('idle')
          setStaticZoom(e.scale)
          setStaticPosition([e.positionX, e.positionY])
        }}
        doubleClick={{ disabled: true }}
        pinch={{ step: 20, disabled: zoomDisabled }}
        wheel={{ step: 100 }}
        scalePadding={{ disabled: true }}
        pan={{ velocity: false }}
      >
        <TransformComponent ref={canvasRef}>
          <div className="w-vw h-vh relative">
            <Container key="elements-container" />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default React.memo(GraphCanvas)
