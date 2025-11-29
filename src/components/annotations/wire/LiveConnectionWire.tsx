import React from 'react'
import type { NodePortReference } from '@/types'
import { useStore } from '$'
import { useNodeAnchorPosition } from '@/hooks'
import { usePageSpaceToWorldSpace } from '@/hooks'
import { Wire } from './Wire'

type LiveConnectionWireProps = {
  portAnchor: NodePortReference
  portAnchorType: 'input' | 'output'
}

/** Draws a wire between a given port and the current cursor position. */
const LiveConnectionWire = ({ portAnchor, portAnchorType }: LiveConnectionWireProps) => {
  const cursor = useStore((state) => state.registry.wires.live.cursor)
  const target = useStore((state) => state.registry.wires.live.target)

  const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

  const portAnchorPosition = useNodeAnchorPosition(portAnchor.nodeInstanceId, portAnchor.portInstanceId)
  const targetAnchorPosition = useNodeAnchorPosition(target?.nodeInstanceId ?? '', target?.portInstanceId ?? '')
  const cursorPosition = cursor ? pageSpaceToWorldSpace(cursor.position.x, cursor.position.y) : null

  if (!portAnchorPosition || !cursorPosition) {
    return null
  }

  const cursorAnchorPosition = { x: cursorPosition[0], y: cursorPosition[1] }

  const start = portAnchorType === 'output' ? portAnchorPosition : targetAnchorPosition ?? cursorAnchorPosition
  const end = portAnchorType === 'input' ? portAnchorPosition : targetAnchorPosition ?? cursorAnchorPosition

  const arrowDirection: 'LTR' | 'RTL' = portAnchorType === 'output' ? 'LTR' : 'RTL'
  const drawArrows = targetAnchorPosition ? undefined : arrowDirection

  return (
    <Wire start={start} end={end} structure="single" drawArrows={drawArrows} drawNodeBackground drawWireBackground />
  )
}

export default React.memo(LiveConnectionWire, (prevProps, nextProps) => {
  const a = prevProps.portAnchor.nodeInstanceId === nextProps.portAnchor.nodeInstanceId
  const b = prevProps.portAnchor.portInstanceId === nextProps.portAnchor.portInstanceId
  const c = prevProps.portAnchorType === nextProps.portAnchorType

  return a && b && c
})
