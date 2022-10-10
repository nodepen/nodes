import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'
import { COLORS, DIMENSIONS } from '@/constants'
import { useDraggableNode } from '../hooks'

type GenericNodeProps = {
  id: string
  template: NodePen.NodeTemplate
}

const {
  COMPONENT_INTERNAL_PADDING,
  COMPONENT_LABEL_WIDTH,
  COMPONENT_MINIMUM_HEIGHT,
  COMPONENT_PARAMETER_MINIMUM_HEIGHT,
  COMPONENT_PARAMETER_MINIMUM_WIDTH,
} = DIMENSIONS

const GenericNode = ({ id, template }: GenericNodeProps): React.ReactElement => {
  const node = useStore((store) => store.document.nodes[id])

  const draggableTargetRef = useDraggableNode(id)

  const { position } = node
  const { nickName, inputs, outputs } = template

  console.log(`⚙️⚙️⚙️ generic-node : ${id.split('-')[0]} : ${nickName.toLowerCase()}`)

  const nodeWidth = COMPONENT_INTERNAL_PADDING * 4 + COMPONENT_PARAMETER_MINIMUM_WIDTH * 2 + COMPONENT_LABEL_WIDTH

  const nodeParameterHeight = Math.max(inputs.length, outputs.length, 1) * COMPONENT_PARAMETER_MINIMUM_HEIGHT
  const nodeContentHeight = Math.max(nodeParameterHeight, COMPONENT_MINIMUM_HEIGHT)
  const nodeHeight = COMPONENT_INTERNAL_PADDING * 2 + nodeContentHeight

  return (
    <g id={`generic-node-${id}`} ref={draggableTargetRef}>
      {/* Shadow */}
      <rect
        x={position.x}
        y={-position.y + 2}
        width={nodeWidth}
        height={nodeHeight}
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
        width={nodeWidth}
        height={nodeHeight}
        rx={7}
        ry={7}
        fill={COLORS.LIGHT}
        stroke={COLORS.DARK}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        pointerEvents="auto"
      />
      <rect
        x={position.x + nodeWidth / 2 - COMPONENT_LABEL_WIDTH / 2}
        y={-position.y + COMPONENT_INTERNAL_PADDING}
        width={COMPONENT_LABEL_WIDTH}
        height={nodeHeight - COMPONENT_INTERNAL_PADDING * 2}
        rx={7}
        ry={7}
        fill={COLORS.LIGHT}
        stroke={COLORS.DARK}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        pointerEvents="none"
      />
    </g>
  )
}

const propsAreEqual = (prevProps: Readonly<GenericNodeProps>, nextProps: Readonly<GenericNodeProps>): boolean => {
  return prevProps.id === nextProps.id
}

export default React.memo(GenericNode, propsAreEqual)
