import React from 'react'
import type { DataTreeStructure } from '@nodepen/core'
import { COLORS } from '@/constants'
import { distance, pointAt } from '@/utils/numerics'

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
  showArrows?: boolean
}

export const Wire = ({ start, end, structure, showArrows = false }: WireProps) => {
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

  const getWireGraphics = (structure: DataTreeStructure) => {
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
            <path d={d} strokeWidth={7} stroke={COLORS.DARK} strokeDasharray="6 10" strokeLinecap="round" fill="none" />
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

  const getArrowGraphics = () => {
    if (!showArrows) {
      return null
    }

    const { x, y } = end

    const S = 12

    return (
      <polyline
        points={`${x},${y - S / 2} ${x + S},${y} ${x},${y + S / 2}`}
        stroke={COLORS.DARK}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    )
  }

  return (
    <>
      {getWireGraphics(structure)}
      {getArrowGraphics()}
    </>
  )
}
