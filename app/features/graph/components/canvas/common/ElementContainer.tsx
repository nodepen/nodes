import React, { useMemo, useCallback, MouseEvent } from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import { NodePen } from 'glib'
import { useCameraDispatch, useCameraMode, useCameraStaticZoom } from '@/features/graph/store/camera/hooks'
import { useGraphDispatch, useGraphSelection } from '@/features/graph/store/graph/hooks'

type ElementContainerProps = {
  children: JSX.Element
  element: NodePen.Element<'static-component' | 'static-parameter' | 'panel' | 'number-slider'>
  disabled?: boolean
}

const ElementContainer = ({ children, element, disabled = false }: ElementContainerProps): React.ReactElement => {
  const {
    id,
    current: {
      position: [x, y],
    },
  } = element

  const { prepareLiveMotion, dispatchLiveMotion, moveElement } = useGraphDispatch()
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
    (e, _) => {
      e.stopPropagation()

      setZoomLock(true)
      prepareLiveMotion({ anchor: id, targets: [id] })
    },
    [id, setZoomLock, prepareLiveMotion]
  )

  const handleDrag: DraggableEventHandler = useCallback(
    (_, d) => {
      const { deltaX, deltaY } = d
      dispatchLiveMotion(deltaX, deltaY)
    },
    [dispatchLiveMotion]
  )

  const handleDragStop: DraggableEventHandler = useCallback(
    (_, d) => {
      const { x, y } = d

      // Unlock camera
      setZoomLock(false)

      // Commit motion to state
      moveElement(id, [x, y])

      // Recalculate staged motion in case we moved a non-selected item
      prepareLiveMotion({ anchor: 'selection', targets: selection })
    },
    [id, selection, setZoomLock, moveElement, prepareLiveMotion]
  )

  return (
    <div className="w-full h-full pointer-events-none absolute left-0 top-0 z-30">
      <div
        className="w-min h-full relative pointer-events-auto"
        onPointerDown={handleStopPropagation}
        onDoubleClick={handleStopPropagation}
      >
        <Draggable
          position={{ x, y }}
          scale={cameraZoom}
          disabled={isDisabled}
          onMouseDown={handleStopPropagation}
          onStart={handleDragStart}
          onDrag={handleDrag}
          onStop={handleDragStop}
        >
          {children}
        </Draggable>
      </div>
    </div>
  )
}

export default React.memo(ElementContainer)