import React, { useRef } from 'react'
import type * as NodePen from '@nodepen/core'
import type { NodePortReference } from '@/types'
import { useNodeAnchorPosition, usePortValues } from '@/hooks'
import { WirePortal, WiresMaskPortal } from './components'
import { Wire } from './Wire'

type PortConnectionWireProps = {
  from: NodePortReference
  to: NodePortReference
}

/** Draws a wire between two node port references based on their position and the source's data structure. */
const PortConnectionWire = ({ from, to }: PortConnectionWireProps): React.ReactElement | null => {
  const { nodeInstanceId: fromNodeId, portInstanceId: fromPortId } = from
  const { nodeInstanceId: toNodeId, portInstanceId: toPortId } = to

  const fromPosition = useNodeAnchorPosition(fromNodeId, fromPortId)
  const toPosition = useNodeAnchorPosition(toNodeId, toPortId)

  const sourceDataTree = usePortValues(fromNodeId, fromPortId)

  const previousStructure = useRef<NodePen.DataTreeStructure>('single')

  if (!fromPosition || !toPosition) {
    return null
  }

  const currentStructure = sourceDataTree?.stats?.treeStructure

  if (currentStructure) {
    previousStructure.current = currentStructure
  }

  const visibleStructure = currentStructure ?? previousStructure.current

  return (
    <>
      <WirePortal>
        <Wire start={fromPosition} end={toPosition} structure={visibleStructure} />
      </WirePortal>
      <WiresMaskPortal>
        <Wire start={fromPosition} end={toPosition} structure={visibleStructure} drawMask />
      </WiresMaskPortal>
    </>
  )
}

export default React.memo(PortConnectionWire, (prevProps, nextProps) => {
  const a = prevProps.from.nodeInstanceId === nextProps.from.nodeInstanceId
  const b = prevProps.from.portInstanceId === nextProps.from.portInstanceId
  const c = prevProps.to.nodeInstanceId === nextProps.to.nodeInstanceId
  const d = prevProps.to.portInstanceId === nextProps.to.portInstanceId

  return a && b && c && d
})
