import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { NodePen } from 'glib'
import { useDebugRender } from '@/hooks'
import { LiveWireElement } from '@/features/graph/store/graph/types'
import { distance } from '@/features/graph/utils'

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

  const dist = distance([ax, ay], [bx, by])
  const [x, y] = [Math.min(ax, bx), Math.min(ay, by)]
  const [width, height] = [Math.abs(bx - ax), Math.abs(by - ay)]
  const lead = Math.max(width / 2, dist / 4)
  const leg = Math.min(height / 4, lead / 2)

  const start = {
    x: ax < bx ? 0 : width,
    y: ay < by ? 0 : height,
  }
  const startLead = {
    x: ax < bx ? start.x + lead : start.x - lead,
    y: start.y,
  }
  const startLeg = {
    x: startLead.x,
    y: ay < by ? startLead.y + leg : startLead.y - leg,
  }

  const end = {
    x: start.x === 0 ? width : 0,
    y: start.y === 0 ? height : 0,
  }
  const endLead = {
    x: ax < bx ? end.x - lead : end.x + lead,
    y: end.y,
  }
  const endLeg = {
    x: endLead.x,
    y: ay < by ? endLead.y - leg : endLead.y + leg,
  }

  const mid = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  }

  const points = `${start.x},${start.y} ${startLead.x},${startLead.y} ${startLeg.x},${startLeg.y} ${mid.x},${mid.y} ${endLeg.x},${endLeg.y} ${endLead.x},${endLead.y} ${end.x},${end.y}`

  // const ymod = by > ay ? -1 : 1
  // const xmod = bx > ax ? -1 : 1

  // const d = [
  //   `M ${start.x} ${start.y} `,
  //   `C ${start.x} ${start.y} ${mid.x + (width * xmod) / 10} ${mid.y + (height * ymod) / 2} ${mid.x} ${mid.y} `,
  //   `S ${end.x} ${end.y} ${end.x} ${end.y} `,
  // ].join('')

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

    const pointLeft = anchorType === 'input' ? bx < ax : ax < bx

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
                strokeWidth="2px"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            ) : (
              <polyline
                points={`${h / 2},2 ${h / 2 + r - 2},${h / 2} ${h / 2},${h - 2} ${h / 2},2`}
                stroke="#333"
                strokeWidth="2px"
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
        <polyline points={points} strokeWidth="3px" stroke="#333333" fill="none" vectorEffect="non-scaling-stroke" />
        {/* <path
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
        /> */}
      </svg>
      {arrow}
    </div>
  )
}

export default React.memo(Wire)
