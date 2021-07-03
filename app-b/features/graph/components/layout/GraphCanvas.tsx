import React from 'react'
import { useCameraDispatch, useCameraMode, useCameraZoomLock } from 'features/graph/store/camera/hooks'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Container } from '../canvas'
import { useGraphManager } from 'context/graph'
import { StaticGrid } from '../layout'

const GraphCanvas = (): React.ReactElement => {
  const { register, registry } = useGraphManager()

  const { setMode, setStaticZoom, setStaticPosition } = useCameraDispatch()
  const zoomDisabled = useCameraZoomLock()
  const cameraMode = useCameraMode()

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
      ref={registry.canvasContainerRef}
    >
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        disabled={cameraMode === 'locked'}
        limitToBounds={false}
        centerZoomedOut={false}
        centerOnInit={false}
        minScale={0.25}
        maxScale={2.5}
        onInit={(ref) => {
          register.setTransform(ref.setTransform)
        }}
        doubleClick={{
          disabled: true,
        }}
        pinch={{
          step: 1,
          disabled: zoomDisabled,
        }}
        wheel={{
          step: 0.2,
          touchPadDisabled: false,
        }}
        panning={{
          velocityDisabled: true,
        }}
        onPanning={() => {
          // TODO: How do we capture motion during a `setTransform` action?
          // TODO: Do we *really* need to?
        }}
        onPanningStop={({ state }) => {
          setStaticPosition([state.positionX, state.positionY])
        }}
        onZoom={() => {
          // TODO: If we cross a 'zoom breakpoint' here, then update 'static' zoom so ZUI elements will update.
        }}
        onZoomStop={({ state }) => {
          setStaticZoom(state.scale)
          setStaticPosition([state.positionX, state.positionY])
        }}
        onWheelStart={() => {
          setMode('zooming')
        }}
        onWheelStop={() => {
          setMode('idle')
        }}
        onPinchingStart={() => {
          setMode('zooming')
        }}
        onPinchingStop={() => {
          setMode('idle')
        }}
      >
        <TransformComponent>
          <div className="w-vw h-vh relative">
            <StaticGrid />
            <Container key="elements-container" />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default React.memo(GraphCanvas)
