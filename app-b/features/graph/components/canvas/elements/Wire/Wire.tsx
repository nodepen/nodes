import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { NodePen } from 'glib'
import { useDebugRender } from '@/hooks'
import { LiveWireElement } from '@/features/graph/store/graph/types'
import { distance, pointBetween } from '@/features/graph/utils'

type WireProps = {
  wire: NodePen.Element<'wire'>
}

const Wire = ({ wire }: WireProps): React.ReactElement => {
  const { id, current, template } = wire
  const {
    from: [ax, ay],
    to: [bx, by],
  } = current

  // useDebugRender(`Wire | ${id}`)
  const t = ax < bx ? 1 : -1

  const dist = distance([ax, ay], [bx, by])
  const [x, y] = [Math.min(ax, bx), Math.min(ay, by)]
  const [width, height] = [Math.abs(bx - ax), Math.abs(by - ay)]
  const lead = Math.max(width / 2, dist / 2)

  const start = {
    x: ax < bx ? 0 : width,
    y: ay < by ? 0 : height,
  }
  const startLead = {
    x: ax < bx ? start.x + lead * t : start.x - lead * t,
    y: start.y,
  }

  const end = {
    x: start.x === 0 ? width : 0,
    y: start.y === 0 ? height : 0,
  }
  const endLead = {
    x: ax < bx ? end.x - lead * t : end.x + lead * t,
    y: end.y,
  }

  const mid = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  }

  const startA1 = pointBetween([start.x, start.y], [startLead.x, startLead.y], 0.7)
  const startA2 = pointBetween([mid.x, mid.y], [startA1.x, startA1.y], 0.5)

  const endA1 = pointBetween([end.x, end.y], [endLead.x, endLead.y], 0.7)

  const d = [
    `M ${start.x} ${start.y} `,
    `C ${startA1.x} ${startA1.y} ${startA2.x} ${startA2.y} ${mid.x} ${mid.y}`,
    `S ${endA1.x} ${endA1.y} ${end.x} ${end.y}`,
  ].join('')

  const pathRef = useRef<SVGPathElement>(null)

  const [offset, setOffset] = useState(0)

  useLayoutEffect(() => {
    if (wire.template.mode !== 'live') {
      return
    }

    const length = pathRef.current ? pathRef.current.getTotalLength() : 0
    const nextOffset = 12 - (length % 12)

    if (offset !== nextOffset) {
      setOffset(nextOffset)
    }
  })

  const arrow = useMemo(() => {
    if (template.mode !== 'live') {
      return null
    }

    const liveWire = wire as LiveWireElement
    const anchorType = liveWire.template.from ? 'input' : 'output'

    const [sx, sy] = anchorType === 'input' ? [ax, ay] : [bx, by]
    const [ex, ey] = anchorType === 'input' ? [bx, by] : [ax, ay]

    // Get absolute position of wire endpoint
    const [left, top] = [ex < sx ? 0 : width, ey < sy ? 0 : height]

    const pointLeft = anchorType === 'output'

    const r = 5
    const h = Math.sqrt(2) * r

    return (
      <div className="absolute w-6 h-6" style={{ left: left - 12, top: top - 12 }}>
        <div className="w-full h-full flex justify-center items-center">
          <svg className="overflow-visible" width="24" height="24" viewBox={`0 0 ${h} ${h}`}>
            {pointLeft ? (
              <polyline
                points={`${h / 2},2 ${h / 2 - r + 2},${h / 2} ${h / 2},${h - 2} ${h / 2},2`}
                stroke="#333"
                strokeWidth="3px"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            ) : (
              <polyline
                points={`${h / 2},2 ${h / 2 + r - 2},${h / 2} ${h / 2},${h - 2} ${h / 2},2`}
                stroke="#333"
                strokeWidth="3px"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
        </div>
      </div>
    )
  }, [ax, ay, bx, by, width, height, wire, template.mode])

  return (
    <div className={`absolute pointer-events-none z-0 overflow-visible`} style={{ width, height, left: x, top: y - 2 }}>
      <svg
        className="absolute left-0 top-0 overflow-visible z-10"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <path
          d={d}
          ref={pathRef}
          strokeWidth="3px"
          stroke="#333333"
          strokeDasharray={template.mode === 'provisional' ? '4 8' : template.mode === 'live' ? '4 8' : ''}
          strokeDashoffset={template.mode === 'live' ? offset : 0}
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
          className={`${template.mode === 'provisional' ? 'animate-march' : 'none'}`}
        />
      </svg>
      {arrow}
    </div>
  )
}

export default React.memo(Wire)
