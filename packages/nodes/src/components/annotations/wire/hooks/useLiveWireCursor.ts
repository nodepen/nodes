import React, { useCallback } from 'react'
import { useDocumentRef, useImperativeEvent } from '@/hooks'
import type { NodePortReference } from '@/types'
import { useDispatch, useStore } from '$'

export const useLiveWireCursor = (anchors: NodePortReference[]) => {
  const documentRef = useDocumentRef()
  const activeCursor = useStore((state) => state.registry.wires.live.cursor)

  const { apply } = useDispatch()

  const isActive = anchors.length > 0

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const { pageX, pageY, pointerId } = e

      console.log('B')

      if (!isActive || !activeCursor || pointerId !== activeCursor.pointerId) {
        return
      }

      console.log('C')

      apply((state) => {
        if (!state.registry.wires.live.cursor) {
          console.log('D')
          return
        }

        state.registry.wires.live.cursor.position = {
          x: pageX,
          y: pageY,
        }
      })
    },
    [isActive, activeCursor]
  )

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      const { pointerId } = e

      if (!isActive || !activeCursor || pointerId !== activeCursor.pointerId) {
        return
      }

      apply((state) => {
        state.registry.wires.live = {
          cursor: null,
          target: null,
          connections: {},
        }
      })
    },
    [isActive, activeCursor]
  )

  useImperativeEvent(documentRef, 'pointermove', handlePointerMove, isActive)
  useImperativeEvent(documentRef, 'pointerup', handlePointerUp, isActive)
}
