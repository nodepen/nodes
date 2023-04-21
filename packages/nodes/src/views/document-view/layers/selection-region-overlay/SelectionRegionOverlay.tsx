import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useStore } from '$'
import { usePageSpaceToWorldSpace } from '@/hooks'

const SelectionRegionOverlay = () => {
  const { apply, commitRegionSelection } = useDispatch()
  const selectionRegionState = useStore((state) => state.registry.selection.region)

  const overlayRef = useRef<HTMLDivElement>(null)

  const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

  useEffect(() => {
    if (!selectionRegionState.isActive) {
      return
    }

    const element = overlayRef.current

    if (!element) {
      return
    }

    element.setPointerCapture(selectionRegionState.pointerId)
  }, [selectionRegionState.isActive])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): void => {
      if (!selectionRegionState.isActive || selectionRegionState.pointerId !== e.pointerId) {
        return
      }

      switch (e.pointerType) {
        case 'mouse': {
          const { pageX, pageY } = e

          const [x, y] = pageSpaceToWorldSpace(pageX, pageY)

          apply((state) => {
            if (!state.registry.selection.region.isActive) {
              return
            }

            state.registry.selection.region.to = { x, y }
          })
        }
      }
    },
    [selectionRegionState]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): void => {
      if (!selectionRegionState.isActive || selectionRegionState.pointerId !== e.pointerId) {
        return
      }

      switch (e.pointerType) {
        case 'mouse': {
          commitRegionSelection()
        }
      }
    },
    [selectionRegionState]
  )

  const { isActive } = selectionRegionState

  return (
    <div
      className={`${isActive ? 'np-pointer-events-auto' : 'np-pointer-events-none'} np-w-full np-h-full`}
      ref={overlayRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  )
}

export default React.memo(SelectionRegionOverlay)
