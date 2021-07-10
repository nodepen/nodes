import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NodePen } from 'glib'
import {
  useCameraDispatch,
  useCameraMode,
  useCameraStaticPosition,
  useCameraStaticZoom,
  useCameraZoomLock,
} from 'features/graph/store/camera/hooks'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Container } from '../canvas'
import { useGraphManager } from 'context/graph'
import { StaticGrid } from '../layout'
import { useLongPress } from 'hooks'
import { useGraphDispatch } from '../../store/graph/hooks'
import { distance, screenSpaceToCameraSpace } from '../../utils'

const GraphCanvas = (): React.ReactElement => {
  const { register, registry } = useGraphManager()

  const { addElement } = useGraphDispatch()
  const { setMode, setStaticZoom, setStaticPosition } = useCameraDispatch()
  const cameraPosition = useCameraStaticPosition()
  const cameraZoom = useCameraStaticZoom()
  const zoomDisabled = useCameraZoomLock()
  const cameraMode = useCameraMode()

  const [longPressActivated, setLongPressActivated] = useState(false)
  const longPressActivatedLocation = useRef<[number, number]>([0, 0])

  const handlePointerMove = useCallback(
    (e: PointerEvent): void => {
      if (!longPressActivated) {
        return
      }

      const [ax, ay] = longPressActivatedLocation.current
      const { pageX: bx, pageY: by } = e

      const distanceFromStart = distance([ax, ay], [bx, by])

      if (distanceFromStart < 15) {
        return
      }

      // Start region selection
      setLongPressActivated(false)

      const region: NodePen.Element<'region'>['template'] = {
        type: 'region',
        mode: 'selection',
        pointer: e.pointerId,
      }

      const [cx, cy] = cameraPosition
      const { pageX: ex, pageY: ey } = e
      const [x, y] = screenSpaceToCameraSpace(
        { offset: [0, 48 + 36], position: [ex, ey] },
        { zoom: cameraZoom, position: [cx, cy] }
      )

      // Add region select element, which will handle the rest
      addElement({
        type: 'region',
        template: region,
        position: [x, y],
      })
    },
    [cameraPosition, cameraZoom, addElement, longPressActivated]
  )

  const handleOpenGraphContextMenu = useCallback(
    (position: [number, number]) => {
      const [x, y] = position
      alert(`Menu: [${x}, ${y}]`)
      setMode('idle')
    },
    [setMode]
  )

  const handlePointerUp = useCallback(
    (e: PointerEvent): void => {
      if (!longPressActivated) {
        return
      }

      // Start graph-level context menu
      const { pageX, pageY } = e
      setLongPressActivated(false)
      handleOpenGraphContextMenu([pageX, pageY])
    },
    [longPressActivated, handleOpenGraphContextMenu]
  )

  useEffect(() => {
    if (!longPressActivated) {
      return
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  })

  const handleLongPress = useCallback(
    (e: PointerEvent): void => {
      const { pageX: ex, pageY: ey } = e

      setMode('locked')
      longPressActivatedLocation.current = [ex, ey]
      setLongPressActivated(true)
    },
    [setMode]
  )

  const longPressTarget = useLongPress(handleLongPress)

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ touchAction: 'none' }}
      onContextMenu={(e) => {
        e.preventDefault()
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== 'mouse') {
          return
        }

        switch (e.button) {
          case 0: {
            //setMode('locked')

            const region: NodePen.Element<'region'>['template'] = {
              type: 'region',
              mode: 'selection',
              pointer: e.pointerId,
            }

            const [cx, cy] = cameraPosition
            const { pageX: ex, pageY: ey } = e
            const [x, y] = screenSpaceToCameraSpace(
              { offset: [0, 48 + 36], position: [ex, ey] },
              { zoom: cameraZoom, position: [cx, cy] }
            )

            // Add region select element, which will handle the rest
            addElement({
              type: 'region',
              template: region,
              position: [x, y],
            })

            e.stopPropagation()
            break
          }
          case 1: {
            const { pageX: ex, pageY: ey } = e
            handleOpenGraphContextMenu([ex, ey])
            break
          }
        }
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
          <div className="w-vw h-vh relative overflow-visible" ref={longPressTarget}>
            <StaticGrid />
            <Container key="elements-container" />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default React.memo(GraphCanvas)
