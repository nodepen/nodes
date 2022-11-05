import React from 'react'
import { useStore } from '$'
import type { NodePortReference } from '@/types'
import { COLORS } from '@/constants'
import { usePortValues } from '@/hooks'

type WireProps = {
  from: NodePortReference
  to: NodePortReference
}

const Wire = ({ from, to }: WireProps): React.ReactElement | null => {
  const { nodeInstanceId: fromNodeId, portInstanceId: fromPortId } = from
  const { nodeInstanceId: toNodeId, portInstanceId: toPortId } = to

  const fromPosition = useAnchorPosition(fromNodeId, fromPortId)
  const toPosition = useAnchorPosition(toNodeId, toPortId)

  const sourceValues = usePortValues(fromNodeId, fromPortId)

  if (!fromPosition || !toPosition) {
    return null
  }

  const { x: ax, y: ay } = fromPosition
  const { x: bx, y: by } = toPosition

  return (
    <WirePortal>
      <line x1={ax} y1={-ay} x2={bx} y2={-by} stroke={COLORS.DARK} strokeWidth={2} />
    </WirePortal>
  )
}

import { createPortal } from 'react-dom'

type WirePortalProps = {
  children: React.ReactNode
}

const WirePortal = ({ children }: WirePortalProps): React.ReactElement | null => {
  const wiresContainerRef = useStore((state) => state.registry.wires.containerRef)
  if (!wiresContainerRef || !wiresContainerRef.current) {
    return null
  }
  return createPortal(children, wiresContainerRef.current)
}

const useAnchorPosition = (nodeId: string, anchorId: string): { x: number; y: number } | null => {
  const nodePosition = useStore((state) => state.document.nodes[nodeId]?.position)
  const anchorDelta = useStore((state) => state.document.nodes[nodeId]?.anchors?.[anchorId])

  if (!nodePosition || !anchorDelta) {
    return null
  }

  const { x, y } = nodePosition
  const { dx, dy } = anchorDelta

  return {
    x: x + dx,
    y: y + dy,
  }
}

export default React.memo(Wire, (prevProps, nextProps) => {
  const a = prevProps.from.nodeInstanceId === nextProps.from.nodeInstanceId
  const b = prevProps.from.portInstanceId === nextProps.from.portInstanceId
  const c = prevProps.to.nodeInstanceId === nextProps.to.nodeInstanceId
  const d = prevProps.to.portInstanceId === nextProps.to.portInstanceId

  return a && b && c && d
})
