import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NodePen } from 'glib'
import {
  useCameraDispatch,
  useCameraMode,
  useCameraStaticPosition,
  useCameraStaticZoom,
  useCameraZoomLevel,
  useCameraZoomLock,
} from 'features/graph/store/camera/hooks'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Container } from '../../canvas'
import { useGraphManager } from '@/features/graph/context/graph'
import { StaticGrid } from '..'
import { useLongPress } from 'hooks'
import { useGraphDispatch } from '../../../store/graph/hooks'
import { distance, screenSpaceToCameraSpace } from '../../../utils'
import { useCanvasMenuActions } from './hooks'
import { GenericMenu, PlaceComponentMenu } from '../../overlay'
import { useAppStore } from '@/features/common/store'

const GraphCanvas = (): React.ReactElement => {
  const { register, registry } = useGraphManager()
  const state = useAppStore()

  const { addLiveElement } = useGraphDispatch()
  const { setMode, setStaticZoom, setStaticPosition, setZoomLevel } = useCameraDispatch()
  const cameraPosition = useCameraStaticPosition()
  const cameraZoom = useCameraStaticZoom()
  const zoomDisabled = useCameraZoomLock()
  const cameraMode = useCameraMode()
  const cameraZoomLevel = useCameraZoomLevel()

  const [longPressActivated, setLongPressActivated] = useState(false)
  const longPressActivatedLocation = useRef<[number, number]>([0, 0])

  const [showCanvasMenu, setShowCanvasMenu] = useState(false)
  const canvasMenuLocation = useRef<[number, number]>([0, 0])

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
      addLiveElement({
        type: 'region',
        template: region,
        position: [x, y],
      })
    },
    [cameraPosition, cameraZoom, addLiveElement, longPressActivated]
  )

  const handleOpenGraphContextMenu = useCallback(
    (position: [number, number]) => {
      canvasMenuLocation.current = position
      setMode('idle')
      setShowCanvasMenu(true)
    },
    [setMode]
  )

  const handlePointerUp = useCallback((): void => {
    if (!longPressActivated) {
      return
    }

    // Start graph-level context menu
    setLongPressActivated(false)
    handleOpenGraphContextMenu(longPressActivatedLocation.current)
  }, [longPressActivated, handleOpenGraphContextMenu])

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
      const cameraMode = state.getState().camera.mode

      if (cameraMode === 'locked') {
        return
      }

      const { pageX: ex, pageY: ey } = e

      setMode('locked')
      longPressActivatedLocation.current = [ex, ey]
      setLongPressActivated(true)
    },
    [setMode, state]
  )

  const longPressTarget = useLongPress(handleLongPress)

  const handleCloseMenu = useCallback((): void => {
    setShowCanvasMenu(false)
  }, [])

  const [showAddComponent, setShowAddComponent] = useState(false)
  const addComponentPosition = useRef<[number, number]>([0, 0])

  const handleAddComponentMenu = useCallback(() => {
    addComponentPosition.current = longPressActivatedLocation.current
    setShowAddComponent(true)
  }, [])

  const actions = useCanvasMenuActions(handleAddComponentMenu)

  useEffect(() => {
    // Hide add-component popup if we begin interacting with a component.
    if (showAddComponent && (zoomDisabled || cameraMode === 'locked')) {
      setShowAddComponent(false)
    }
  }, [showAddComponent, zoomDisabled, cameraMode])

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ touchAction: 'none' }}
      onContextMenu={(e) => {
        e.preventDefault()
      }}
      onDoubleClick={(e) => {
        const { pageX, pageY } = e

        addComponentPosition.current = [pageX, pageY]
        setShowAddComponent(true)
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== 'mouse') {
          return
        }

        switch (e.button) {
          case 0: {
            //setMode('locked')
            if (showAddComponent) {
              return
            }

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
            addLiveElement({
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
        velocityAnimation={{ disabled: true }}
        zoomAnimation={{ disabled: true }}
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
        onZoom={({ state }) => {
          // If we cross a 'zoom breakpoint' here, then update the zoom level in state.

          const breakpoints = {
            near: 0.75,
            default: 2,
          }

          const zoomLevel: typeof cameraZoomLevel =
            state.scale < breakpoints.near ? 'far' : state.scale < breakpoints.default ? 'default' : 'near'

          if (cameraZoomLevel !== zoomLevel) {
            setZoomLevel(zoomLevel)
          }
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
      {showCanvasMenu ? (
        <GenericMenu
          context={{} as never}
          actions={actions}
          position={canvasMenuLocation.current}
          onClose={handleCloseMenu}
        />
      ) : null}
      {showAddComponent ? (
        <PlaceComponentMenu position={addComponentPosition.current} onClose={() => setShowAddComponent(false)} />
      ) : null}
    </div>
  )
}

export default React.memo(GraphCanvas)
