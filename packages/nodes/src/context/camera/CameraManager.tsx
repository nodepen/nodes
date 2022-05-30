import React, { useRef, useEffect, useCallback } from 'react'
import { useStore } from '$'
import { CAMERA } from '@/constants'
import { clamp } from '@/utils'
import { usePageSpaceToWorldSpace } from '@/hooks'

type CameraManagerProps = {
  children?: React.ReactNode
}

const CameraManager = ({ children }: CameraManagerProps): React.ReactElement => {
  const cameraOverlayRef = useRef<HTMLDivElement>(null)

  const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

  const zoom = useRef<number>(useStore.getState().camera.zoom)
  useEffect(
    () =>
      useStore.subscribe((state) => {
        zoom.current = state.camera.zoom
      }),
    []
  )

  const setCameraPosition = useStore((store) => store.dispatch.setCameraPosition)
  const setCameraZoom = useStore((store) => store.dispatch.setCameraZoom)

  const initialCameraPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const initialScreenPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const isPanActive = useRef(false)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    e.stopPropagation()

    switch (e.pointerType) {
      case 'mouse': {
        const { pageX, pageY } = e

        switch (e.button) {
          case 0: {
            const [x, y] = pageSpaceToWorldSpace(pageX, pageY)
            console.log({ x, y })

            break
          }
          case 1: {
            // Only start pan if using right click
            break
          }
          case 2: {
            // Initialize move
            isPanActive.current = true

            initialScreenPosition.current = { x: pageX, y: pageY }

            const { x, y } = useStore.getState().camera.position
            initialCameraPosition.current = { x, y }
            break
          }
        }

        break
      }
      case 'pen':
      case 'touch': {
        break
      }
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!isPanActive.current) {
      return
    }

    switch (e.pointerType) {
      case 'mouse': {
        const { pageX: currentScreenX, pageY: currentScreenY } = e
        const { x: initialScreenX, y: initialScreenY } = initialScreenPosition.current

        const totalDeltaX = currentScreenX - initialScreenX
        const totalDeltaY = currentScreenY - initialScreenY

        const { x, y } = initialCameraPosition.current

        const dx = -totalDeltaX / zoom.current
        const dy = totalDeltaY / zoom.current

        setCameraPosition(x + dx, y + dy)
        break
      }
      case 'pen':
      case 'touch': {
        break
      }
    }
  }

  const resetLocalState = useCallback(() => {
    isPanActive.current = false
  }, [])

  const handlePointerUp = (_e: React.PointerEvent<HTMLDivElement>): void => {
    resetLocalState()
  }

  const handlePointerOut = (_e: React.PointerEvent<HTMLDivElement>): void => {
    resetLocalState()
  }

  const handleWheel = (e: WheelEvent): void => {
    e.stopPropagation()
    e.preventDefault()

    const { pageX, pageY, deltaY } = e

    // Calculate next zoom
    const isIncreasing = deltaY > 0
    const step = 0.1 * (isIncreasing ? -1 : 1)
    const nextZoom = clamp(zoom.current + step, CAMERA.MINIMUM_ZOOM, CAMERA.MAXIMUM_ZOOM)

    // Calculate next position, based on cursor position
    const [cursorWorldX, cursorWorldY] = pageSpaceToWorldSpace(pageX, pageY)
    const { x: cameraWorldX, y: cameraWorldY } = useStore.getState().camera.position

    const vec = {
      x: cameraWorldX - cursorWorldX,
      y: cameraWorldY - cursorWorldY,
    }

    const zoomDelta = nextZoom - zoom.current

    const transform = {
      x: (vec.x / nextZoom) * -zoomDelta,
      y: (vec.y / nextZoom) * -zoomDelta,
    }

    setCameraZoom(nextZoom)
    setCameraPosition(cameraWorldX + transform.x, cameraWorldY + transform.y)
  }

  useEffect(() => {
    const container = cameraOverlayRef.current

    if (!container) {
      return
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  })

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault()
  }

  return (
    <div
      className="np-w-full np-h-full np-overflow-visible"
      ref={cameraOverlayRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerOut}
      onContextMenu={handleContextMenu}
    >
      {children}
    </div>
  )
}

export default React.memo(CameraManager)
