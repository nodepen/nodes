import React from 'react'
import type { DataTreeStructure } from '@nodepen/core'
import type { NodePortReference } from '@/types'
import { COLORS } from '@/constants'
import { useNodeAnchorPosition, usePortValues } from '@/hooks'
import { getDataTreeStructure } from '@/utils/data-trees'
import { distance, pointAt } from '@/utils/numerics'
import { WirePortal } from './components'

type WireProps = {
  from: NodePortReference
  to: NodePortReference
}

const Wire = ({ from, to }: WireProps): React.ReactElement | null => {
  const { nodeInstanceId: fromNodeId, portInstanceId: fromPortId } = from
  const { nodeInstanceId: toNodeId, portInstanceId: toPortId } = to

  const fromPosition = useNodeAnchorPosition(fromNodeId, fromPortId)
  const toPosition = useNodeAnchorPosition(toNodeId, toPortId)

  const sourceValues = usePortValues(fromNodeId, fromPortId)

  if (!fromPosition || !toPosition) {
    return null
  }

  const start = fromPosition
  const end = toPosition

  const mid = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  }

  const dist = distance([start.x, start.y], [end.x, end.y])
  const width = Math.abs(end.x - start.x)

  // Calculate horizontal offset from port for bezier control point
  const lead = Math.max(width / 2, dist / 2)
  const invert = start.x < end.x ? 1 : -1

  const startLead = {
    x: start.x < end.x ? start.x + lead * invert : start.x - lead * invert,
    y: start.y,
  }
  const endLead = {
    x: start.x < end.x ? end.x - lead * invert : end.x + lead * invert,
    y: end.y,
  }

  const aLeftAnchor = pointAt([start.x, start.y], [startLead.x, startLead.y], 0.7)
  const aRightAnchor = pointAt([mid.x, mid.y], [aLeftAnchor.x, aLeftAnchor.y], 0.5)

  // path `S` directive makes `bLeftAnchor` a reflection of `aRightAnchor`
  const bRightAnchor = pointAt([end.x, end.y], [endLead.x, endLead.y], 0.7)

  const d = [
    `M ${start.x} ${start.y}`,
    `C ${aLeftAnchor.x} ${aLeftAnchor.y} ${aRightAnchor.x} ${aRightAnchor.y} ${mid.x} ${mid.y}`,
    `S ${bRightAnchor.x} ${bRightAnchor.y} ${end.x} ${end.y}`,
  ].join('')

  const getWireStyle = (structure: DataTreeStructure) => {
    switch (structure) {
      case 'empty':
      case 'single': {
        return <path d={d} strokeWidth={3} stroke={COLORS.DARK} fill="none" />
      }
      case 'list': {
        return (
          <>
            <path d={d} strokeWidth={7} stroke={COLORS.DARK} fill="none" />
            <path d={d} strokeWidth={3} stroke={COLORS.LIGHT} fill="none" />
          </>
        )
      }
      case 'tree': {
        return (
          <>
            <path d={d} strokeWidth={7} stroke={COLORS.DARK} strokeDasharray="6 10" strokeLinecap="round" fill="none" />
            <path
              d={d}
              strokeWidth={3}
              stroke={COLORS.LIGHT}
              strokeDasharray="6 10"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )
      }
    }
  }

  const wireStructure = getDataTreeStructure(sourceValues ?? {})
  const wire = getWireStyle(wireStructure)

  return <WirePortal>{wire}</WirePortal>
}

export default React.memo(Wire, (prevProps, nextProps) => {
  const a = prevProps.from.nodeInstanceId === nextProps.from.nodeInstanceId
  const b = prevProps.from.portInstanceId === nextProps.from.portInstanceId
  const c = prevProps.to.nodeInstanceId === nextProps.to.nodeInstanceId
  const d = prevProps.to.portInstanceId === nextProps.to.portInstanceId

  return a && b && c && d
})
