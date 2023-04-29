import React from 'react'
import { usePageSpaceToOverlaySpace } from '@/hooks'

type WireEditCursorProps = {
  mode: string
  position: {
    x: number
    y: number
  }
}

export const WireEditCursor = ({ position }: WireEditCursorProps) => {
  const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

  const [cx, cy] = pageSpaceToOverlaySpace(position.x, position.y)

  const CURSOR_OFFSET = 9

  const x = cx + CURSOR_OFFSET
  const y = cy + CURSOR_OFFSET

  return <div className="np-w-8 np-h-8 np-bg-red np-absolute" style={{ left: x, top: y }} />
}
