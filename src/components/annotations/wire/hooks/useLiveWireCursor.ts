import { useCallback } from 'react'
import { useDocumentRef, useImperativeEvent } from '@/hooks'
import type { NodePortReference } from '@/types'
import { useDispatch } from '$'

export const useLiveWireCursor = (anchors: NodePortReference[]) => {
  const documentRef = useDocumentRef()

  const { apply, commitLiveWireEdit } = useDispatch()

  const isActive = anchors.length > 0

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const { pageX, pageY, pointerId } = e

    switch (e.pointerType) {
      case 'pen':
      case 'touch': {
        return
      }
      case 'mouse': {
        apply((state) => {
          state.registry.wires.live.cursor = {
            pointerId,
            position: {
              x: pageX,
              y: pageY,
            },
          }
        })
      }
    }
  }, [])

  const handlePointerUp = useCallback((e: PointerEvent) => {
    switch (e.pointerType) {
      case 'pen':
      case 'touch': {
        return
      }
      case 'mouse': {
        commitLiveWireEdit()
      }
    }
  }, [])

  useImperativeEvent(documentRef, 'pointermove', handlePointerMove, isActive)
  useImperativeEvent(documentRef, 'pointerup', handlePointerUp, isActive)
}
