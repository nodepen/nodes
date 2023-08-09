import React, { useMemo } from 'react'
import type { DataTreeStructure, DocumentNode } from '@nodepen/core'
import { COLORS, DIMENSIONS, KEYS } from '@/constants'
import { distance, pointAt } from '@/utils/numerics'
import { useStore } from '$'

type WireProps = {
  start: {
    x: number
    y: number
  }
  end: {
    x: number
    y: number
  }
  structure: DataTreeStructure
  drawArrows?: 'LTR' | 'RTL'
  drawNodeBackground?: boolean
  drawWireBackground?: boolean
  drawMask?: boolean
}

export const Wire = ({
  start,
  end,
  structure,
  drawArrows,
  drawNodeBackground = false,
  drawWireBackground = false,
  drawMask = false,
}: WireProps) => {
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

  const NODE_BACKGROUND_STROKE = structure === 'single' ? 6 : 10

  // The graphics for either the wire proper or its mask
  const getWireGraphics = (structure: DataTreeStructure) => {
    if (drawMask) {
      switch (structure) {
        case 'empty':
        case 'single': {
          return <path d={d} strokeWidth={5} stroke="#FFFFFF" fill="none" strokeLinecap="round" />
        }
        case 'list':
        case 'tree': {
          return <path d={d} strokeWidth={9} stroke="#FFFFFF" fill="none" strokeLinecap="round" />
        }
      }
    } else {
      switch (structure) {
        case 'empty':
        case 'single': {
          return <path d={d} strokeWidth={3} stroke={COLORS.DARK} fill="none" strokeLinecap="round" />
        }
        case 'list': {
          return (
            <>
              <path d={d} strokeWidth={7} stroke={COLORS.DARK} fill="none" strokeLinecap="round" />
              <path d={d} strokeWidth={3} stroke={COLORS.LIGHT} fill="none" strokeLinecap="round" />
            </>
          )
        }
        case 'tree': {
          return (
            <>
              <path
                d={d}
                strokeWidth={7}
                stroke={COLORS.DARK}
                strokeDasharray="6 10"
                strokeLinecap="round"
                fill="none"
              />
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
  }

  const getArrowPolylinePoints = (closed: boolean) => {
    const { x, y } = drawArrows === 'LTR' ? end : start

    const S = 12

    switch (drawArrows) {
      case 'LTR': {
        return `${x},${y - S / 2} ${x + S},${y} ${x},${y + S / 2} ${closed ? `${x},${y - S / 2}` : ''}`
      }
      case 'RTL': {
        return `${x},${y - S / 2} ${x - S},${y} ${x},${y + S / 2} ${closed ? `${x},${y - S / 2}` : ''}`
      }
      default: {
        return ''
      }
    }
  }

  const getArrowGraphics = () => {
    if (!drawArrows) {
      return null
    }

    return (
      <polyline
        points={getArrowPolylinePoints(false)}
        stroke={COLORS.DARK}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    )
  }

  const getNodeBodyClipPath = (node: DocumentNode) => {
    const { position } = node

    return (
      <rect
        x={position.x - 2}
        y={position.y - 2}
        width={node.dimensions.width + 4}
        height={node.dimensions.height + 6}
        rx={7}
        ry={7}
        fill="none"
        stroke={COLORS.DARK}
        strokeWidth={9}
      />
    )
  }

  const getNodeLabelClipPath = (node: DocumentNode) => {
    const { position } = node

    const { dx } = node.anchors['labelDeltaX']

    return (
      <rect
        x={position.x + dx - DIMENSIONS.NODE_LABEL_WIDTH / 2 - 1}
        y={position.y + DIMENSIONS.NODE_INTERNAL_PADDING - 1}
        width={DIMENSIONS.NODE_LABEL_WIDTH + 2}
        height={node.dimensions.height - DIMENSIONS.NODE_INTERNAL_PADDING * 2 + 2}
        rx={7}
        ry={7}
        fill={COLORS.LIGHT}
        stroke={COLORS.DARK}
        strokeWidth={2}
      />
    )
  }

  const nodeBackgroundClipPath = useMemo(() => {
    const nodes = Object.values(useStore.getState().document.nodes)
    const selection = useStore.getState().registry.selection.nodes

    if (!drawNodeBackground) {
      return null
    }

    return (
      <defs>
        <clipPath id="live-wire-background-clip-light">
          {nodes.map((node) => {
            const { instanceId, position, anchors } = node

            const isSelected = selection.includes(instanceId)

            return (
              <>
                {isSelected ? getNodeLabelClipPath(node) : getNodeBodyClipPath(node)}
                {Object.values(anchors).map((anchor) => {
                  const { x, y } = position
                  const { dx, dy } = anchor

                  return (
                    <>
                      <circle cx={x + dx} cy={y + dy} r={DIMENSIONS.NODE_PORT_RADIUS + 2} fill="none" />
                      <circle cx={x + dx} cy={y + dy + 1} r={DIMENSIONS.NODE_PORT_RADIUS + 2} fill="none" />
                    </>
                  )
                })}
              </>
            )
          })}
        </clipPath>
        <clipPath id="live-wire-background-clip-green">
          {nodes.map((node) => {
            const { instanceId } = node

            const isSelected = selection.includes(instanceId)

            if (!isSelected) {
              return <></>
            }

            return getNodeBodyClipPath(node)
          })}
        </clipPath>
      </defs>
    )
  }, [])

  const getNodeBackgroundGraphics = () => {
    if (!drawNodeBackground) {
      return null
    }

    return (
      <>
        <g clipPath="url(#live-wire-background-clip-green)">
          <path
            d={d}
            stroke={COLORS.GREEN}
            strokeWidth={NODE_BACKGROUND_STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {drawArrows ? (
            <polyline
              points={getArrowPolylinePoints(true)}
              stroke={COLORS.GREEN}
              strokeWidth={NODE_BACKGROUND_STROKE}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={COLORS.GREEN}
            />
          ) : null}
        </g>
        <g clipPath="url(#live-wire-background-clip-light)">
          <path
            d={d}
            stroke={COLORS.LIGHT}
            strokeWidth={NODE_BACKGROUND_STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {drawArrows ? (
            <polyline
              points={getArrowPolylinePoints(true)}
              stroke={COLORS.LIGHT}
              strokeWidth={NODE_BACKGROUND_STROKE}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={COLORS.LIGHT}
            />
          ) : null}
        </g>
      </>
    )
  }

  const getWireBackgroundGraphics = () => {
    if (!drawWireBackground) {
      return null
    }

    return (
      <g mask={`url(#${KEYS.ELEMENT_IDS.WIRES_MASK_ID})`}>
        <path d={d} stroke={COLORS.PALE} strokeWidth={NODE_BACKGROUND_STROKE} fill="none" />
        {drawArrows ? (
          <polyline
            points={getArrowPolylinePoints(true)}
            stroke={COLORS.PALE}
            strokeWidth={NODE_BACKGROUND_STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={COLORS.PALE}
          />
        ) : null}
      </g>
    )
  }

  return (
    <>
      {nodeBackgroundClipPath}
      {getWireBackgroundGraphics()}
      {getNodeBackgroundGraphics()}
      {getWireGraphics(structure)}
      {getArrowGraphics()}
    </>
  )
}
