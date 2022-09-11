import type React from 'react'
import { useCallback, useRef } from 'react'
import { useDispatch, useStore, useStoreRef } from '$'
import { useImperativeEvent } from '@/hooks'

export const useDraggableNode = (nodeInstanceId: string): React.RefObject<SVGRectElement> => {
    const nodeRef = useRef<SVGRectElement>(null)

  const { setNodePosition } = useDispatch()

  const zoom = useStoreRef((state) => state.camera.zoom)

  const isDragging = useRef(false)
  const initialPointerId = useRef<number>()
  const initialPointerPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const initialNodePosition = useRef<{ x: number; y: number }>(useStore.getState().document.nodes[nodeInstanceId].position)

  const handlePointerDown = useCallback((e: PointerEvent): void => {
    const container = nodeRef.current

    if (!container) {
      return
    }

    if (isDragging.current) {
      // Already dragging, discard event
      return
    }

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
            initialPointerId.current = e.pointerId
            container.setPointerCapture(e.pointerId)

            // Begin motion
            isDragging.current = true

            console.log('???')

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
    const { pageX, pageY, pointerId } = e

    if (!isDragging.current || pointerId !== initialPointerId.current) {
      return
    }

    console.log(nodeInstanceId)
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