import React, { useEffect, useRef } from 'react'
import { useCameraDispatch, useCameraZoomLock } from '../../store/hooks'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Container } from '../canvas'
import { CameraControls } from '../utils'
import { SetTransform } from '../../types'

const GraphCanvas = (): React.ReactElement => {
  const { setMode, setLiveZoom, setStaticZoom, setPosition } = useCameraDispatch()
  const zoomDisabled = useCameraZoomLock()

  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    setTimeout(() => {
      console.log('ok')
      ;(canvasRef.current as any).context.dispatch.setTransform(35, 35, 1, 300, 'linear')
    }, 5000)
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
        onPanning={(x: any) => {
          setPosition([x.positionX, x.positionY])
        }}
        onZoomChange={(zoom: any) => {
          setLiveZoom(zoom.scale)
          setPosition([zoom.positionX, zoom.positionY])
        }}
        onWheelStart={() => {
          setMode('zooming')
        }}
        onWheelStop={(e: any) => {
          setMode('idle')
          setStaticZoom(e.scale)
        }}
        onPinchingStart={() => {
          setMode('zooming')
        }}
        onPinchingStop={(e: any) => {
          setMode('idle')
          setStaticZoom(e.scale)
        }}
        pinch={{ step: 20, disabled: zoomDisabled }}
        wheel={{ step: 100 }}
        scalePadding={{ disabled: true }}
        pan={{ velocity: false }}
      >
        {({ setTransform }: { setTransform: SetTransform }) => (
          <>
            <CameraControls setTransform={setTransform} />
            <TransformComponent ref={canvasRef}>
              <div className="w-vw h-vh relative">
                <Container key="elements-container" />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}

export default React.memo(GraphCanvas)
