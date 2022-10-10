import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'
import { COLORS } from '@/constants'
import { useDraggableNode } from '../hooks'

type GenericNodeProps = {
  id: string
  template: NodePen.NodeTemplate
}

const GenericNode = ({ id, template }: GenericNodeProps): React.ReactElement => {
  const node = useStore((store) => store.document.nodes[id])

  const draggableTargetRef = useDraggableNode(id)

  const { position } = node
  const { nickName, inputs, outputs } = template

  console.log(`⚙️⚙️⚙️ generic-node : ${id.split('-')[0]} : ${nickName.toLowerCase()}`)

  return (
    <g id={`generic-node-${id}`} ref={draggableTargetRef}>
      {/* Shadow */}
      <rect
        x={position.x}
        y={-position.y + 2}
        width={250}
        height={120}
        rx={7}
        ry={7}
        fill={COLORS.DARK}
        stroke={COLORS.DARK}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
      {/* Body */}
      <rect
        x={position.x}
        y={-position.y}
        width={250}
        height={120}
        rx={7}
        ry={7}
        fill={COLORS.LIGHT}
        stroke={COLORS.DARK}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        pointerEvents="auto"
      />
    </g>
  )
}

const propsAreEqual = (prevProps: Readonly<GenericNodeProps>, nextProps: Readonly<GenericNodeProps>): boolean => {
  return prevProps.id === nextProps.id
}

export default React.memo(GenericNode, propsAreEqual)
