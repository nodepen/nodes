import React, { useRef, useEffect, useCallback } from 'react'
import { useStore } from '$'

type CameraManagerProps = {
  children?: React.ReactNode
}

const CameraManager = ({ children }: CameraManagerProps): React.ReactElement => {
  const cameraScreenRef = useRef<HTMLDivElement>(null)

  const zoom = useRef<number>(useStore.getState().camera.zoom)
  useEffect(
    () =>
      useStore.subscribe((state) => {
        zoom.current = state.camera.zoom
      }),
    []
  )

  const setCameraPosition = useStore((store) => store.setCameraPosition)
  const setCameraZoom = useStore((store) => store.setCameraZoom)

  const initialCameraPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const initialScreenPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const isPanActive = useRef(false)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    // Initialize move
    isPanActive.current = true

    e.stopPropagation()

    switch (e.pointerType) {
      case 'mouse': {
        const { pageX, pageY } = e
        initialScreenPosition.current = { x: pageX, y: pageY }

        const { x, y } = useStore.getState().camera.position
        initialCameraPosition.current = { x, y }
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

        const dx = -totalDeltaX
        const dy = totalDeltaY

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

    const isIncreasing = e.deltaY > 0

    const step = 0.1 * (isIncreasing ? -1 : 1)

    // TODO: CLamp
    setCameraZoom(zoom.current + step)
  }

  useEffect(() => {
    const container = cameraScreenRef.current

    if (!container) {
      return
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  })

  return (
    <div
      className="np-w-full np-h-full np-overflow-y-auto"
      ref={cameraScreenRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerOut}
    >
      {children}
    </div>
  )
}

export default React.memo(CameraManager)
