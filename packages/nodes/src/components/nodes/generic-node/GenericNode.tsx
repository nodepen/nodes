import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'
import { COLORS, DIMENSIONS } from '@/constants'
import { useDraggableNode } from '../hooks'
import { getNodeWidth, getNodeHeight } from '@/utils/node-dimensions'
import { Wire } from '@/components/annotations/wire'
import { GenericNodePort } from './components'

type GenericNodeProps = {
  id: string
  template: NodePen.NodeTemplate
}

const { NODE_INTERNAL_PADDING, NODE_LABEL_WIDTH, NODE_LABEL_FONT_SIZE, NODE_PORT_LABEL_FONT_SIZE, NODE_PORT_RADIUS } =
  DIMENSIONS

const GenericNode = ({ id, template }: GenericNodeProps): React.ReactElement => {
  const node = useStore((store) => store.document.nodes[id])

  const { position } = node

  console.log(`⚙️⚙️⚙️ Rendered generic node [${id.split('-')[0]}] (${template.nickName})`)

  const draggableTargetRef = useDraggableNode(id)

  const nodeWidth = getNodeWidth()
  const nodeHeight = getNodeHeight(template)

  const nodePortInstanceIds = [...Object.keys(node.inputs), ...Object.keys(node.outputs)]

  return (
    <>
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
        />
        {nodePortInstanceIds.map((portInstanceId) => {
          const portAnchor = node.anchors[portInstanceId]

          if (!portAnchor) {
            return null
          }

          const portPosition = {
            x: position.x + portAnchor.dx - NODE_PORT_RADIUS,
            y: position.y + portAnchor.dy + NODE_PORT_RADIUS,
          }

          return (
            <rect
              x={portPosition.x}
              y={-portPosition.y}
              width={NODE_PORT_RADIUS * 2}
              height={NODE_PORT_RADIUS * 2 + 2}
              rx={NODE_PORT_RADIUS}
              ry={NODE_PORT_RADIUS}
              fill={COLORS.DARK}
              stroke={COLORS.DARK}
              strokeWidth={2}
            />
          )
        })}
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
          pointerEvents="auto"
        />
        {/* Label */}
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
          pointerEvents="none"
        />
        <path
          id={`node-label-${id}`}
          fill="none"
          d={`M ${position.x + nodeWidth / 2 + NODE_LABEL_FONT_SIZE / 2 - 3} ${-position.y + nodeHeight} L ${
            position.x + nodeWidth / 2 + NODE_LABEL_FONT_SIZE / 2 - 3
          } ${-position.y}`}
        />
        <text className="np-font-panel np-select-none" fill={COLORS.DARK} fontSize={NODE_LABEL_FONT_SIZE}>
          <textPath href={`#node-label-${id}`} startOffset="50%" textAnchor="middle" alignmentBaseline="middle">
            {template.nickName.toUpperCase()}
          </textPath>
        </text>
        {/* Ports */}
        {Object.entries(node.inputs).map(([inputPortInstanceId, order]) => (
          <GenericNodePort
            key={`generic-node-input-port-${inputPortInstanceId}`}
            nodeInstanceId={id}
            portInstanceId={inputPortInstanceId}
            template={template.inputs[order]}
          />
        ))}
        {Object.entries(node.outputs).map(([outputPortInstanceId, order]) => (
          <GenericNodePort
            key={`generic-node-output-port-${outputPortInstanceId}`}
            nodeInstanceId={id}
            portInstanceId={outputPortInstanceId}
            template={template.outputs[order]}
          />
        ))}
      </g>
      {/* Wires */}
      {Object.entries(node.sources).map(([inputPortInstanceId, sources]) => {
        const currentInput = {
          nodeInstanceId: node.instanceId,
          portInstanceId: inputPortInstanceId,
        }

        return Object.values(sources).map((source) => {
          const wireKey = [
            'np-generic-node-wire',
            source.nodeInstanceId,
            source.portInstanceId,
            currentInput.nodeInstanceId,
            currentInput.portInstanceId,
          ].join('-')

          return <Wire key={wireKey} from={source} to={currentInput} />
        })
      })}
    </>
  )
}

const propsAreEqual = (prevProps: Readonly<GenericNodeProps>, nextProps: Readonly<GenericNodeProps>): boolean => {
  return prevProps.id === nextProps.id
}

export default React.memo(GenericNode, propsAreEqual)
