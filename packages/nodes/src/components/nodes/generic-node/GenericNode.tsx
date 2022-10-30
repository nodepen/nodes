import React, { useMemo } from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'
import { COLORS, DIMENSIONS } from '@/constants'
import { useDraggableNode } from '../hooks'

type GenericNodeProps = {
  id: string
  template: NodePen.NodeTemplate
}

const {
  NODE_INTERNAL_PADDING,
  NODE_LABEL_WIDTH,
  NODE_LABEL_FONT_SIZE,
  NODE_MINIMUM_HEIGHT,
  NODE_PORT_LABEL_FONT_SIZE,
  NODE_PORT_MINIMUM_HEIGHT,
  NODE_PORT_MINIMUM_WIDTH,
  NODE_PORT_RADIUS,
} = DIMENSIONS

const GenericNode = ({ id, template }: GenericNodeProps): React.ReactElement => {
  const node = useStore((store) => store.document.nodes[id])

  const draggableTargetRef = useDraggableNode(id)

  const { position } = node
  const { nickName, inputs, outputs } = template

  console.log(`⚙️⚙️⚙️ Rendered generic node [${id.split('-')[0]}] (${nickName})`)

  const nodeWidth = NODE_INTERNAL_PADDING * 4 + NODE_PORT_MINIMUM_WIDTH * 2 + NODE_LABEL_WIDTH

  const nodeParameterHeight = Math.max(inputs.length, outputs.length, 1) * NODE_PORT_MINIMUM_HEIGHT
  const nodeContentHeight = Math.max(nodeParameterHeight, NODE_MINIMUM_HEIGHT)
  const nodeHeight = NODE_INTERNAL_PADDING * 2 + nodeContentHeight

  // TODO: Refactor out repetition, extract to util, add tests
  const getPortColumnPosition = (orderNumber: number, direction: 'input' | 'output'): [x: number, y: number] => {
    switch (direction) {
      case 'input': {
        const x = position.x

        const columnVerticalStep = inputs.length === 0 ? nodeContentHeight : nodeContentHeight / inputs.length

        const currentVerticalNodePosition = -position.y
        const currentVerticalPadding = NODE_INTERNAL_PADDING
        const currentVerticalPortPosition = orderNumber * columnVerticalStep
        const currentVerticalPortCenterOffset = columnVerticalStep / 2

        const y =
          currentVerticalNodePosition +
          currentVerticalPadding +
          currentVerticalPortPosition +
          currentVerticalPortCenterOffset

        return [x, y]
      }
      case 'output': {
        const x = position.x + nodeWidth

        const columnVerticalStep = outputs.length === 0 ? nodeContentHeight : nodeContentHeight / outputs.length

        const currentVerticalNodePosition = -position.y
        const currentVerticalPadding = NODE_INTERNAL_PADDING
        const currentVerticalPortPosition = orderNumber * columnVerticalStep
        const currentVerticalPortCenterOffset = columnVerticalStep / 2

        const y =
          currentVerticalNodePosition +
          currentVerticalPadding +
          currentVerticalPortPosition +
          currentVerticalPortCenterOffset

        return [x, y]
      }
    }
  }

  const inputPorts = inputs.map((input, i) => {
    const [x, y] = getPortColumnPosition(i, 'input')

    return (
      <circle
        key={`generic-node-input-port-${input.name}`}
        r={NODE_PORT_RADIUS}
        cx={x}
        cy={y}
        fill={COLORS.LIGHT}
        stroke={COLORS.DARK}
        strokeWidth={2}
        // vectorEffect="non-scaling-stroke"
      />
    )
  })

  const inputPortShadows = inputs.map((input, i) => {
    const [x, y] = getPortColumnPosition(i, 'input')

    return (
      <circle
        key={`generic-node-input-port-shadow-${input.name}`}
        r={NODE_PORT_RADIUS}
        cx={x}
        cy={y + 2}
        fill={COLORS.DARK}
        stroke={COLORS.DARK}
        strokeWidth={2}
        // vectorEffect="non-scaling-stroke"
      />
    )
  })

  const inputPortLabels = inputs.map((input, i) => {
    const { nickName } = input

    const [x, y] = getPortColumnPosition(i, 'input')

    return (
      <text
        key={`generic-node-input-port-label-${input.name}`}
        x={x + 12}
        y={y - 3 + NODE_PORT_LABEL_FONT_SIZE / 2}
        className="np-font-mono np-select-none"
        fontSize={NODE_PORT_LABEL_FONT_SIZE}
        fill={COLORS.DARK}
      >
        {nickName}
      </text>
    )
  })

  const outputPorts = outputs.map((output, i) => {
    const [x, y] = getPortColumnPosition(i, 'output')

    return (
      <circle
        key={`generic-node-output-port-${output.name}`}
        r={NODE_PORT_RADIUS}
        cx={x}
        cy={y}
        fill={COLORS.LIGHT}
        stroke={COLORS.DARK}
        strokeWidth={2}
        // vectorEffect="non-scaling-stroke"
      />
    )
  })

  const outputPortShadows = outputs.map((output, i) => {
    const [x, y] = getPortColumnPosition(i, 'output')

    return (
      <circle
        key={`generic-node-output-port-shadow-${output.name}`}
        r={NODE_PORT_RADIUS}
        cx={x}
        cy={y + 2}
        fill={COLORS.DARK}
        stroke={COLORS.DARK}
        strokeWidth={2}
        // vectorEffect="non-scaling-stroke"
      />
    )
  })

  const outputPortLabels = outputs.map((output, i) => {
    const { nickName } = output

    const [x, y] = getPortColumnPosition(i, 'output')

    return (
      <text
        key={`generic-node-output-port-label-${output.name}`}
        x={x - 12}
        y={y - 3 + NODE_PORT_LABEL_FONT_SIZE / 2}
        className="np-font-mono np-select-none"
        fontSize={NODE_PORT_LABEL_FONT_SIZE}
        fill={COLORS.DARK}
        textAnchor="end"
      >
        {nickName}
      </text>
    )
  })

  const nodeLabel = (
    <>
      <path
        id={`node-label-${id}`}
        fill="none"
        // stroke="red"
        d={`M ${position.x + nodeWidth / 2 + NODE_LABEL_FONT_SIZE / 2 - 3} ${-position.y + nodeHeight} L ${
          position.x + nodeWidth / 2 + NODE_LABEL_FONT_SIZE / 2 - 3
        } ${-position.y}`}
      />
      <text className="np-font-panel np-select-none" fill={COLORS.DARK} fontSize={NODE_LABEL_FONT_SIZE}>
        <textPath href={`#node-label-${id}`} startOffset="50%" textAnchor="middle" alignmentBaseline="middle">
          {nickName.toUpperCase()}
        </textPath>
      </text>
    </>
  )

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
        // vectorEffect="non-scaling-stroke"
      />
      {inputPortShadows}
      {outputPortShadows}
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
        // vectorEffect="non-scaling-stroke"
        pointerEvents="auto"
      />
      <rect
        x={position.x + nodeWidth / 2 - NODE_LABEL_WIDTH / 2}
        y={-position.y + NODE_INTERNAL_PADDING}
        width={NODE_LABEL_WIDTH}
        height={nodeHeight - NODE_INTERNAL_PADDING * 2}
        rx={7}
        ry={7}
        fill={COLORS.LIGHT}
        stroke={COLORS.DARK}
        strokeWidth={2}
        // vectorEffect="non-scaling-stroke"
        pointerEvents="none"
      />
      {inputPorts}
      {outputPorts}
      {inputPortLabels}
      {outputPortLabels}
      {nodeLabel}
    </g>
  )
}

const propsAreEqual = (prevProps: Readonly<GenericNodeProps>, nextProps: Readonly<GenericNodeProps>): boolean => {
  return prevProps.id === nextProps.id
}

export default React.memo(GenericNode, propsAreEqual)
