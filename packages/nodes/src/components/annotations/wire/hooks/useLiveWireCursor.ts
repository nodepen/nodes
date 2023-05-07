import { useCallback } from 'react'
import { useDocumentRef, useImperativeEvent } from '@/hooks'
import type { NodePortReference } from '@/types'
import { useDispatch } from '$'
import { getWireEditModalityFromEvent } from '@/utils/wires'

export const useLiveWireCursor = (anchors: NodePortReference[]) => {
  const documentRef = useDocumentRef()

  const { apply } = useDispatch()

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
            mode: getWireEditModalityFromEvent(e),
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
        apply((state) => {
          state.registry.wires.live = {
            cursor: null,
            target: null,
            connections: {},
          }
        })
      }
    }
  }, [])

  useImperativeEvent(documentRef, 'pointermove', handlePointerMove, isActive)
  useImperativeEvent(documentRef, 'pointerup', handlePointerUp, isActive)
}
