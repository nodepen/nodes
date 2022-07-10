import React, { useCallback, useRef } from 'react'
import { useStore, useDispatch } from '$'
import { useZoomSubscription } from './hooks'

type CommonNodeContainerProps = {
  id: string
  children: React.ReactNode
}

const DraggableNodeContainer = ({ id, children }: CommonNodeContainerProps): React.ReactElement => {
  const nodeRef = useRef<SVGGElement>(null)

  const { setNodePosition } = useDispatch()

  const zoom = useZoomSubscription()

  const isDragging = useRef(false)
  const initialPointerId = useRef<number>()
  const initialPointerPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const initialNodePosition = useRef<{ x: number; y: number }>(useStore.getState().document.nodes[id].position)

  const handlePointerDown = useCallback((e: React.PointerEvent<SVGGElement>): void => {
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

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGGElement>): void => {
    const { pageX, pageY, pointerId } = e

    if (!isDragging.current || pointerId !== initialPointerId.current) {
      return
    }

    console.log(id)
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent<SVGGElement>): void => {
    const { pointerId } = e

    if (pointerId !== initialPointerId.current) {
      return
    }

    isDragging.current = false
    initialPointerId.current = undefined
  }, [])

  return (
    <g
      id={`document-node-${id}`}
      ref={nodeRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {children}
    </g>
  )
}

export default React.memo(DraggableNodeContainer)
