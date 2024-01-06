import { useDispatch, useStore } from '$'
import type { RefObject } from 'react'
import { useCallback, useRef } from 'react'

type ResizableNodeTargets = {
  topLeftTargetRef: RefObject<SVGGElement>
  topRightTargetRef: RefObject<SVGElement>
  bottomLeftTargetRef: RefObject<SVGGElement>
  bottomRightTargetRef: RefObject<SVGGElement>
}

export const useResizableNode = (nodeInstanceId: string): ResizableNodeTargets => {
  const topLeftTargetRef = useRef<SVGGElement>(null)
  const topRightTargetRef = useRef<SVGGElement>(null)
  const bottomLeftTargetRef = useRef<SVGGElement>(null)
  const bottomRightTargetRef = useRef<SVGGElement>(null)

  const { apply } = useDispatch()

  const activeResizeTarget = useRef<'tl' | 'tr' | 'bl' | 'br'>()
  const isResizeActive = useRef(false)

  const initialNodePosition = useRef<{ x: number; y: number }>()
  const initialCursorPosition = useRef<{ x: number; y: number }>()

  const handleTopLeftPointerDown = useCallback((e: PointerEvent): void => {
    const el = topLeftTargetRef.current

    if (!el) {
      return
    }

    if (isResizeActive.current) {
      return
    }

    const { pageX, pageY, pointerId } = e

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
  }, [])

  return { topLeftTargetRef, topRightTargetRef, bottomLeftTargetRef, bottomRightTargetRef }
}
