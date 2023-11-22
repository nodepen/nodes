import React, { useCallback } from 'react'
import type * as NodePen from '@nodepen/core'
import { useLongHover, useNodeAnchorPosition, usePageSpaceToOverlaySpace } from '@/hooks'
import { COLORS, DIMENSIONS } from '@/constants'
import { usePort } from '../../hooks'
import { useDispatch } from '$'

const { NODE_PORT_LABEL_FONT_SIZE, NODE_PORT_LABEL_OFFSET, NODE_PORT_RADIUS, NODE_PORT_MINIMUM_WIDTH } = DIMENSIONS

type GenericNodePortProps = {
  nodeInstanceId: string
  portInstanceId: string
  template: NodePen.PortTemplate
}

const GenericNodePort = ({ nodeInstanceId, portInstanceId, template }: GenericNodePortProps) => {
  const portRef = usePort(nodeInstanceId, portInstanceId, template)

  const { apply } = useDispatch()
  const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

  const handleLongHover = useCallback(
    (e: PointerEvent): void => {
      const { pageX, pageY } = e

      const [x, y] = pageSpaceToOverlaySpace(pageX, pageY)

      apply((state) => {
        state.registry.tooltips[`port-tooltip-${nodeInstanceId}-${portInstanceId}`] = {
          configuration: {
            position: {
              x: x + 8,
              y: y + 8,
            },
            isSticky: false,
          },
          context: {
            type: 'port',
            template,
            nodeInstanceId,
            portInstanceId,
          },
        }
      })
    },
    [pageSpaceToOverlaySpace]
  )

  const longHoverTarget = useLongHover<SVGGElement>(handleLongHover)

  const position = useNodeAnchorPosition(nodeInstanceId, portInstanceId)

  if (!position) {
    console.log(`🐍 Missing port position for node [${nodeInstanceId}]`)
    return null
  }

  const { __direction: direction } = template

  const labelPosition = {
    x: direction === 'input' ? position.x + NODE_PORT_LABEL_OFFSET : position.x - NODE_PORT_LABEL_OFFSET,
    y: position.y + 1.5 + NODE_PORT_LABEL_FONT_SIZE / 4,
  }

  const labelTextAnchor = direction === 'input' ? 'start' : 'end'

  const eventTargetAreaOffset = 18

  const eventTargetAreaPosition = {
    x:
      direction === 'input'
        ? position.x - NODE_PORT_RADIUS - eventTargetAreaOffset
        : position.x - NODE_PORT_MINIMUM_WIDTH,
    y: position.y - NODE_PORT_RADIUS - NODE_PORT_LABEL_FONT_SIZE,
  }

  const eventTargetAreaHeight = NODE_PORT_LABEL_FONT_SIZE * 2 + NODE_PORT_RADIUS * 2

  const eventTargetAreaWidth = NODE_PORT_MINIMUM_WIDTH + NODE_PORT_RADIUS + eventTargetAreaOffset

  return (
    <g id={`generic-node-${direction}-port-${portInstanceId}`} ref={portRef}>
      <circle
        r={NODE_PORT_RADIUS}
        cx={position.x}
        cy={position.y}
        fill={COLORS.LIGHT}
        stroke={COLORS.DARK}
        strokeWidth={2}
      />
      <text
        x={labelPosition.x}
        y={labelPosition.y}
        className="np-font-mono np-select-none"
        fontSize={NODE_PORT_LABEL_FONT_SIZE}
        fill={COLORS.DARK}
        textAnchor={labelTextAnchor}
      >
        {template.nickName}
      </text>
      <g ref={longHoverTarget}>
        <rect
          x={eventTargetAreaPosition.x}
          y={eventTargetAreaPosition.y}
          height={eventTargetAreaHeight}
          width={eventTargetAreaWidth}
          fill={'#FFFFFF'}
          opacity={0}
        />
      </g>
    </g>
  )
}

export default React.memo(GenericNodePort)
