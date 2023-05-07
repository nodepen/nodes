import React, { useCallback } from 'react'
import { useDocumentRef, useImperativeEvent, usePageSpaceToOverlaySpace } from '@/hooks'
import type { CursorConfiguration, WireEditCursorContext } from '../../types'
import { getWireEditIcon, getWireEditModalityFromEvent } from '@/utils/wires'
import { useDispatch } from '@/store'

type WireEditCursorProps = {
  configuration: CursorConfiguration
  context: WireEditCursorContext
}

export const WireEditCursor = ({ configuration, context }: WireEditCursorProps) => {
  const { position } = configuration
  const { mode } = context

  const { apply } = useDispatch()

  const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

  const [cx, cy] = pageSpaceToOverlaySpace(position.x, position.y)

  const CURSOR_OFFSET = 3

  const x = cx + CURSOR_OFFSET
  const y = cy - 32 - CURSOR_OFFSET

  const documentRef = useDocumentRef()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault()

    const mode = getWireEditModalityFromEvent(e)

    apply((state) => {
      state.registry.wires.live.mode = mode
    })
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault()

    const mode = getWireEditModalityFromEvent(e)

    apply((state) => {
      state.registry.wires.live.mode = mode
    })
  }, [])

  useImperativeEvent(documentRef, 'keydown', handleKeyDown)
  useImperativeEvent(documentRef, 'keyup', handleKeyUp)

  return (
    <div className="np-w-8 np-h-8 np-absolute" style={{ left: x, top: y }}>
      {getWireEditIcon(mode)}
    </div>
  )
}
