import React, { useCallback } from 'react'
import type * as NodePen from '@nodepen/core'
import { COLORS, DIMENSIONS } from '@/constants'
import { useLongHover, usePageSpaceToOverlaySpace } from '@/hooks'
import { useDispatch } from '$'

const { NODE_INTERNAL_PADDING, NODE_LABEL_FONT_SIZE, NODE_LABEL_WIDTH } = DIMENSIONS

type GenericNodeLabelProps = {
  node: NodePen.DocumentNode
  template: NodePen.NodeTemplate
}

export const GenericNodeLabel = ({ node, template }: GenericNodeLabelProps) => {
  const { instanceId: id, position, anchors } = node

  const { dx } = anchors['labelDeltaX']

  const { apply } = useDispatch()

  const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

  const handleLongHover = useCallback(
    (e: PointerEvent): void => {
      const { pageX, pageY } = e

      const [x, y] = pageSpaceToOverlaySpace(pageX, pageY)

      apply((state) => {
        state.registry.tooltips[`graph-node-${node.instanceId}`] = {
          configuration: {
            position: {
              x: x + 8,
              y: y + 8,
            },
            isSticky: false,
          },
          context: {
            type: 'node-template-summary',
            template,
          },
        }
      })
    },
    [pageSpaceToOverlaySpace]
  )

  const longHoverTarget = useLongHover<SVGGElement>(handleLongHover)

  const nodeWidth = node.dimensions.width
  const nodeHeight = node.dimensions.height

  return (
    <>
      <g id={`node-label-${node.instanceId}`} ref={longHoverTarget} className=" np-pointer-events-auto">
        <rect
          x={position.x + dx - NODE_LABEL_WIDTH / 2}
          y={position.y + NODE_INTERNAL_PADDING}
          width={NODE_LABEL_WIDTH}
          height={nodeHeight - NODE_INTERNAL_PADDING * 2}
          rx={7}
          ry={7}
          fill={COLORS.LIGHT}
          stroke={COLORS.DARK}
          strokeWidth={2}
        />
      </g>
      <path
        id={`node-label-path-${id}`}
        fill="none"
        d={`M ${position.x + dx + NODE_LABEL_FONT_SIZE / 2 - 2} ${position.y + nodeHeight} L ${
          position.x + dx + NODE_LABEL_FONT_SIZE / 2 - 3
        } ${position.y}`}
      />
      <text
        className="np-font-panel np-select-none np-pointer-events-none"
        fill={COLORS.DARK}
        fontSize={NODE_LABEL_FONT_SIZE}
      >
        <textPath href={`#node-label-path-${id}`} startOffset="50%" textAnchor="middle">
          {template.nickName.toUpperCase()}
        </textPath>
      </text>
    </>
  )
}
