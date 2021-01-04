import React from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { position } from '@/utils'
import { SourceTooltip } from './common'

type WireProps = {
  instanceId: string
}

export const Wire = ({ instanceId: id }: WireProps): React.ReactElement | null => {
  const { store: { elements } } = useGraphManager()

  if (!elements[id]) {
    console.error(`Element '${id}' does not exist.'`)
    return null
  }

  const element = elements[id] as Glasshopper.Element.Wire

  if (!isWire(element)) {
    console.error(`Element ${id} is not a 'wire' element.`)
    return null
  }

  const { current } = element

  if (current.mode === 'hidden') {
    return null
  }

  const [ax, ay] = current.from
  const [bx, by] = current.to

  const [from, to] = position.getExtents(current.from, current.to)

  const min = { x: from[0], y: from[1] }
  const max = { x: to[0], y: to[1] }

  const width = Math.abs(ax - bx)
  const height = Math.abs(ay - by)

  const start = {
    x: ax < bx ? 0 : width,
    y: ay < by ? height : 0,
  }
  const end = {
    x: start.x === 0 ? width : 0,
    y: start.y === 0 ? height : 0
  }
  const mid = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  }

  const goingRight = start.x < end.x
  const goingDown = start.y < end.y

  const o = goingRight ? 25 : -25
  const wc = width * (goingRight ? 0.15 : -0.35)
  const hc = height * (goingDown ? 0.35 : -0.35)

  const d = [
    `M ${start.x} ${start.y} `,
    // `L ${start.x + o} ${start.y} `,
    `C ${start.x + wc} ${start.y} ${mid.x - (wc / 1.5)} ${mid.y - hc} ${mid.x} ${mid.y} `,
    `S ${end.x - wc} ${end.y} ${end.x} ${end.y} `,
    // `L ${end.x} ${end.y}`
  ].join('')

  return (
    <div className="absolute z-10 overflow-visible pointer-events-none" style={{ left: min.x, top: -max.y, width, height }}>
      <div className="relative w-full h-full">
        <svg className="absolute left-0 top-0 overflow-visible z-10" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <path d={d} strokeWidth="2px" stroke="#333333" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        {id === 'live-wire' ? (
          <div className={`${goingRight ? 'right-0' : 'left-0'} absolute`} style={{ top: goingDown ? height : 0 }}>
            <SourceTooltip wire={element} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

const isWire = (element: Glasshopper.Element.Base): element is Glasshopper.Element.Wire => {
  return element.template.type === 'wire'
}