import React from 'react'
import { usePageSpaceToOverlaySpace } from '@/hooks'
import type { CursorConfiguration, WireEditCursorContext } from '../types'

type WireEditCursorProps = {
  configuration: CursorConfiguration
  context: WireEditCursorContext
}

export const WireEditCursor = ({ configuration, context }: WireEditCursorProps) => {
  const { position } = configuration

  const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

  const [cx, cy] = pageSpaceToOverlaySpace(position.x, position.y)

  const CURSOR_OFFSET = 9

  const x = cx + CURSOR_OFFSET
  const y = cy + CURSOR_OFFSET

  return <div className="np-w-8 np-h-8 np-bg-dark np-absolute" style={{ left: x, top: y }} />
}
