import React, { useMemo, useCallback, MouseEvent, useRef, useEffect } from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import { NodePen } from 'glib'
import { useCameraDispatch, useCameraMode, useCameraStaticZoom } from '@/features/graph/store/camera/hooks'
import { useGraphDispatch, useGraphSelection } from '@/features/graph/store/graph/hooks'
import { useClickSelection } from '@/features/graph/hooks'
import { distance } from '@/features/graph/utils'

type ElementContainerProps = {
  children: JSX.Element
  element: NodePen.Element<'static-component' | 'static-parameter' | 'panel' | 'number-slider'>
  disabled?: boolean
  onStart?: DraggableEventHandler
  onDrag?: DraggableEventHandler
  onStop?: (e: Parameters<DraggableEventHandler>[0], d: Parameters<DraggableEventHandler>[1]) => { selection: boolean }
}

/**
 * The generic element container wraps its child and attaches all draggable event and propagation logic.
 * TODO: Something funky is happening with how this interacts with any `Draggable` children.
 */
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
    // console.log(`ElementContainer : handleStopPropagation : ${e.type}`)

    e.stopPropagation()
  }, [])

  const handleClickSelection = useClickSelection(element.id)

  const dragStartTime = useRef(Date.now())
  const dragStartPosition = useRef<[number, number]>([0, 0])

  const handleDragStart: DraggableEventHandler = useCallback(
    (e, d) => {
      e.stopPropagation()

      // console.log('ElementContainer : handleDragStart')

      // Cache initial motion data
      const { x, y } = d
      dragStartTime.current = Date.now()
      dragStartPosition.current = [x, y]

      // Perform state operations
      setZoomLock(true)
      prepareLiveMotion({ anchor: id, targets: [id] })

      // Run callback, if provided
      onStart?.(e, d)
    },
    [id, setZoomLock, prepareLiveMotion, onStart]
  )

  const handleDrag: DraggableEventHandler = useCallback(
    (e, d) => {
      const { deltaX: dx, deltaY: dy } = d
      dispatchLiveMotion(dx, dy)

      onDrag?.(e, d)
    },
    [dispatchLiveMotion, onDrag]
  )

  const handleDragStop: DraggableEventHandler = useCallback(
    (e, d) => {
      const { x, y } = d

      // console.log('ElementContainer : handleDragStop')

      // Perform state operations
      setZoomLock(false)
      moveElement(id, [x, y])

      // Perform cleanup operations
      // Recalculate staged motion in case we moved a non-selected item
      prepareLiveMotion({ anchor: 'selection', targets: selection })

      // Run callback, if provided
      const stop = onStop?.(e, d)

      if (!stop?.selection) {
        // Handle click, if motion was sufficiently short
        const dragDuration = Date.now() - dragStartTime.current
        const dragDistance = distance(dragStartPosition.current, [x, y])

        if (dragDuration < 250 && dragDistance < 15) {
          handleClickSelection()
        }
      }
    },
    [id, selection, setZoomLock, moveElement, prepareLiveMotion, onStop, handleClickSelection]
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

    isRegistered.current = true
  }, [])

  return (
    <div className="w-full h-full pointer-events-none absolute left-0 top-0 z-30">
      <div className="w-min h-full relative">
        <Draggable
          position={{ x, y }}
          scale={cameraZoom}
          cancel=".no-drag"
          disabled={isDisabled}
          onStart={handleDragStart}
          onDrag={handleDrag}
          onStop={handleDragStop}
        >
          <div
            className="pointer-events-auto"
            role="presentation"
            ref={containerRef}
            onPointerDown={handleStopPropagation}
            onMouseDown={handleStopPropagation}
            onDoubleClick={handleStopPropagation}
          >
            {children}
          </div>
        </Draggable>
      </div>
    </div>
  )
}

export default React.memo(ElementContainer)
