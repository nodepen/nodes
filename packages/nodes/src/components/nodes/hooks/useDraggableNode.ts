import type React from 'react'
import { useCallback, useRef } from 'react'
import { useDispatch, useStore, useStoreRef } from '$'
import { useImperativeEvent } from '@/hooks'

export const useDraggableNode = (nodeInstanceId: string): React.RefObject<SVGRectElement> => {
    const nodeRef = useRef<SVGRectElement>(null)

  const { setNodePosition } = useDispatch()

  const zoom = useStoreRef((state) => state.camera.zoom)

  const getCurrentNodePosition = (id: string): { x: number, y: number } => {
    return useStore.getState().document.nodes[nodeInstanceId].position
  }

  const isDragging = useRef(false)
  const initialPointerId = useRef<number>()
  const initialPointerPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const initialNodePosition = useRef<{ x: number; y: number }>(getCurrentNodePosition(nodeInstanceId))

  const handlePointerDown = useCallback((e: PointerEvent): void => {
    const container = nodeRef.current

    if (!container) {
      return
    }

    if (isDragging.current) {
      // Already dragging, discard event
      return
    }

    const { pageX, pageY, pointerId } = e

    switch (e.pointerType) {
      case 'pen':
      case 'touch': {
        // TODO: Support touch events
        return
      }
      case 'mouse': {
        switch (e.button) {
          case 0: {
            // Handle left mouse down
            e.stopPropagation()

            // Register main pointer
            initialPointerId.current = pointerId
            container.setPointerCapture(pointerId)

            // Begin motion
            isDragging.current = true
            initialNodePosition.current = getCurrentNodePosition(nodeInstanceId)
            initialPointerPosition.current = { x: pageX, y: pageY }

            return
          }
          case 1: {
            // Handle center mouse down
            return
          }
          case 2: {
            // Handle right mouse down
            return
          }
        }
      }
    }
  }, [])

  const handlePointerMove = useCallback((e: PointerEvent): void => {
    const { pageX: currentPointerX, pageY: currentPointerY, pointerId } = e

    if (!isDragging.current || pointerId !== initialPointerId.current) {
      return
    }

    const { x: initialPointerX, y: initialPointerY } = initialPointerPosition.current

    // TODO: Include zoom
    const dx = currentPointerX - initialPointerX
    const dy = (currentPointerY - initialPointerY) * -1

    const { x: initialNodeX, y: initialNodeY } = initialNodePosition.current

    const currentNodeX = initialNodeX + dx
    const currentNodeY = initialNodeY + dy

    setNodePosition(nodeInstanceId, currentNodeX, currentNodeY)
  }, [])

  const handlePointerUp = useCallback((e: PointerEvent): void => {
    const { pointerId } = e

    if (pointerId !== initialPointerId.current) {
      return
    }

    isDragging.current = false
    initialPointerId.current = undefined
  }, [])

  useImperativeEvent(nodeRef, 'pointerdown', handlePointerDown)
  useImperativeEvent(nodeRef, 'pointermove', handlePointerMove)
  useImperativeEvent(nodeRef, 'pointerup', handlePointerUp)

  return nodeRef
}