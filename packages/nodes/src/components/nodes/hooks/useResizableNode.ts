import { useDispatch, useStoreRef } from '$'
import { useImperativeEvent } from '@/hooks'
import type { RefObject } from 'react'
import { useCallback, useRef } from 'react'
import type * as NodePen from '@nodepen/core'

type ResizableNodeTargets = {
  topLeftTargetRef: RefObject<SVGGElement>
  topRightTargetRef: RefObject<SVGElement>
  bottomLeftTargetRef: RefObject<SVGGElement>
  bottomRightTargetRef: RefObject<SVGGElement>
}

type ResizeTargetType = 'tl' | 'tr' | 'bl' | 'br'

export const useResizableNode = (nodeInstanceId: string): ResizableNodeTargets => {
  const topLeftTargetRef = useRef<SVGGElement>(null)
  const topRightTargetRef = useRef<SVGGElement>(null)
  const bottomLeftTargetRef = useRef<SVGGElement>(null)
  const bottomRightTargetRef = useRef<SVGGElement>(null)

  const node = useStoreRef((state) => state.document.nodes[nodeInstanceId])

  const { apply } = useDispatch()

  const isResizeActive = useRef(false)
  const activeResizeTargetType = useRef<ResizeTargetType>()

  const initialCursorPosition = useRef<{ x: number; y: number }>()
  const initialNodeDimensions = useRef<NodePen.DocumentNode['dimensions']>()
  const initialNodePosition = useRef<NodePen.DocumentNode['position']>()

  const handlePointerDown = useCallback(
    (e: PointerEvent, resizeTargetElement: SVGGElement | null, resizeTargetType: ResizeTargetType): void => {
      if (isResizeActive.current) {
        // Currently resizing, ignore other pointers
        return
      }

      if (!resizeTargetElement) {
        console.log(
          `🐍 Attempted to resize node \`${nodeInstanceId}\` but failed to find \`${resizeTargetType}\` resize target.`
        )
        return
      }

      isResizeActive.current = true
      activeResizeTargetType.current = resizeTargetType

      const { pageX, pageY, pointerId } = e
      resizeTargetElement.setPointerCapture(pointerId)

      initialCursorPosition.current = { x: pageX, y: pageY }
      initialNodeDimensions.current = structuredClone(node.current.dimensions)
      initialNodePosition.current = structuredClone(node.current.position)

      switch (e.pointerType) {
        case 'pen':
        case 'touch': {
          return
        }
        case 'mouse': {
          switch (e.button) {
            case 0: {
              // Handle left mouse
              return
            }
            case 1: {
              // Handle center mouse down
              return
            }
            case 2: {
              // Handle right mouse button
              return
            }
          }
        }
      }
    },
    []
  )

  const handleTopLeftPointerDown = useCallback(
    (e: PointerEvent): void => {
      handlePointerDown(e, topLeftTargetRef.current, 'tl')
    },
    [handlePointerDown]
  )

  const handleTopRightPointerDown = useCallback(
    (e: PointerEvent): void => {
      handlePointerDown(e, topRightTargetRef.current, 'tr')
    },
    [handlePointerDown]
  )

  const handleBottomLeftPointerDown = useCallback(
    (e: PointerEvent): void => {
      handlePointerDown(e, bottomLeftTargetRef.current, 'bl')
    },
    [handlePointerDown]
  )

  const handleBottomRightPointerDown = useCallback(
    (e: PointerEvent): void => {
      handlePointerDown(e, bottomRightTargetRef.current, 'br')
    },
    [handlePointerDown]
  )

  useImperativeEvent(topLeftTargetRef, 'pointerdown', handleTopLeftPointerDown)
  useImperativeEvent(topRightTargetRef, 'pointerdown', handleTopRightPointerDown)
  useImperativeEvent(bottomLeftTargetRef, 'pointerdown', handleBottomLeftPointerDown)
  useImperativeEvent(bottomRightTargetRef, 'pointerdown', handleBottomRightPointerDown)

  return { topLeftTargetRef, topRightTargetRef, bottomLeftTargetRef, bottomRightTargetRef }
}
