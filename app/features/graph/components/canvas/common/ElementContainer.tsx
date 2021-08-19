import React, { useMemo, useCallback, MouseEvent, useRef, useEffect } from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import { NodePen } from 'glib'
import { useCameraDispatch, useCameraMode, useCameraStaticZoom } from '@/features/graph/store/camera/hooks'
import { useGraphDispatch, useGraphSelection } from '@/features/graph/store/graph/hooks'

type ElementContainerProps = {
  children: JSX.Element
  element: NodePen.Element<'static-component' | 'static-parameter' | 'panel' | 'number-slider'>
  disabled?: boolean
  onStart?: DraggableEventHandler
  onDrag?: DraggableEventHandler
  onStop?: DraggableEventHandler
}

const ElementContainer = ({
  children,
  element,
  disabled = false,
  onStart,
  onDrag,
  onStop,
}: ElementContainerProps): React.ReactElement => {
  const {
    id,
    current: {
      position: [x, y],
    },
  } = element

  const { prepareLiveMotion, dispatchLiveMotion, moveElement, registerElement } = useGraphDispatch()
  const selection = useGraphSelection()

  const { setZoomLock } = useCameraDispatch()
  const cameraZoom = useCameraStaticZoom()
  const cameraMode = useCameraMode()

  const isDisabled = useMemo(() => {
    const tests = [disabled, cameraMode !== 'idle']

    return tests.some((disable) => disable)
  }, [disabled, cameraMode])

  const handleStopPropagation = useCallback((e: PointerEvent | MouseEvent | globalThis.MouseEvent): void => {
    e.stopPropagation()
  }, [])

  const handleDragStart: DraggableEventHandler = useCallback(
    (e, d) => {
      e.stopPropagation()

      setZoomLock(true)
      prepareLiveMotion({ anchor: id, targets: [id] })

      onStart?.(e, d)
    },
    [id, setZoomLock, prepareLiveMotion, onStart]
  )

  const handleDrag: DraggableEventHandler = useCallback(
    (e, d) => {
      const { deltaX, deltaY } = d
      dispatchLiveMotion(deltaX, deltaY)

      onDrag?.(e, d)
    },
    [dispatchLiveMotion, onDrag]
  )

  const handleDragStop: DraggableEventHandler = useCallback(
    (e, d) => {
      const { x, y } = d

      // Unlock camera
      setZoomLock(false)

      // Commit motion to state
      moveElement(id, [x, y])

      // Recalculate staged motion in case we moved a non-selected item
      prepareLiveMotion({ anchor: 'selection', targets: selection })

      onStop?.(e, d)
    },
    [id, selection, setZoomLock, moveElement, prepareLiveMotion, onStop]
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const isRegistered = useRef(false)

  useEffect(() => {
    if (isRegistered.current) {
      return
    }

    if (!containerRef.current) {
      return
    }

    const { width: clientWidth, height: clientHeight } = containerRef.current.getBoundingClientRect()

    const [width, height] = [clientWidth / cameraZoom, clientHeight / cameraZoom]

    registerElement({
      id,
      dimensions: [width, height],
      adjustment: [width / -2, height / -2],
    })
  }, [])

  return (
    <div className="w-full h-full pointer-events-none absolute left-0 top-0 z-30">
      <div className="w-min h-full relative">
        <Draggable
          position={{ x, y }}
          scale={cameraZoom}
          cancel=".no-drag"
          disabled={isDisabled}
          onMouseDown={handleStopPropagation}
          onStart={handleDragStart}
          onDrag={handleDrag}
          onStop={handleDragStop}
        >
          <div
            className="pointer-events-auto"
            role="presentation"
            ref={containerRef}
            onPointerDown={handleStopPropagation}
            onDoubleClick={handleStopPropagation}
            onMouseDown={handleStopPropagation}
          >
            {children}
          </div>
        </Draggable>
      </div>
    </div>
  )
}

export default React.memo(ElementContainer)
