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
  const [width, height] = [Math.abs(bx - ax), Math.max(2, Math.abs(by - ay))]
  const lead = Math.max(width / 2, dist / 2)

  const invert = ax < bx ? 1 : -1

  const start = {
    x: ax < bx ? 0 : width,
    y: ay < by ? 0 : height,
  }
  const startLead = {
    x: ax < bx ? start.x + lead * invert : start.x - lead * invert,
    y: start.y,
  }

  const end = {
    x: start.x === 0 ? width : 0,
    y: start.y === 0 ? height : 0,
  }
  const endLead = {
    x: ax < bx ? end.x - lead * invert : end.x + lead * invert,
    y: end.y,
  }

  const mid = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  }

  const startA1 = pointAt([start.x, start.y], [startLead.x, startLead.y], 0.7)
  const startA2 = pointAt([mid.x, mid.y], [startA1.x, startA1.y], 0.5)

  const endA1 = pointAt([end.x, end.y], [endLead.x, endLead.y], 0.7)

  const d = [
    `M ${start.x} ${start.y} `,
    `C ${startA1.x} ${startA1.y} ${startA2.x} ${startA2.y} ${mid.x} ${mid.y}`,
    `S ${endA1.x} ${endA1.y} ${end.x} ${end.y}`,
  ].join('')

  const [x, y] = [Math.min(ax, bx), Math.min(ay, by)]

  return (
    <WirePortal>
      {/* <line x1={ax} y1={-ay} x2={bx} y2={-by} stroke={COLORS.DARK} strokeWidth={2} /> */}
      <path
        d={d}
        strokeWidth={2}
        stroke={COLORS.DARK}
        fill="none"
        style={{ transform: `translate(${x}px, ${-y}px)` }}
      />
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
