import React from 'react'
import { useStore } from '$'
import type { NodePortReference } from '@/types'
import { COLORS } from '@/constants'
import { usePortValues } from '@/hooks'
import { pointAt } from '@/utils/numerics'

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

  const dist = distance([ax, ay], [bx, by])
  const width = Math.abs(bx - ax)

  const mid = {
    x: (ax + bx) / 2,
    y: (ay + by) / 2,
  }

  // Calculate horizontal offset from port for bezier control point
  const lead = Math.max(width / 2, dist / 2)
  const invert = ax < bx ? 1 : -1

  const startLead = {
    x: ax < bx ? ax + lead * invert : ax - lead * invert,
    y: ay,
  }
  const endLead = {
    x: ax < bx ? bx - lead * invert : bx + lead * invert,
    y: by,
  }

  const aLeftAnchor = pointAt([ax, ay], [startLead.x, startLead.y], 0.7)
  const aRightAnchor = pointAt([mid.x, mid.y], [aLeftAnchor.x, aLeftAnchor.y], 0.5)

  // path `S` directive makes `bLeftAnchor` a reflection of `aRightAnchor`
  const bRightAnchor = pointAt([bx, by], [endLead.x, endLead.y], 0.7)

  const d = [
    `M ${ax} ${-ay}`,
    `C ${aLeftAnchor.x} ${-aLeftAnchor.y} ${aRightAnchor.x} ${-aRightAnchor.y} ${mid.x} ${-mid.y}`,
    `S ${bRightAnchor.x} ${-bRightAnchor.y} ${bx} ${-by}`,
  ].join('')

  return (
    <WirePortal>
      <path d={d} strokeWidth={2} stroke={COLORS.DARK} fill="none" />
    </WirePortal>
  )
}

import { createPortal } from 'react-dom'
import { distance } from '@/utils/numerics'

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
