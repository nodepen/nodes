import React from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { position } from '@/utils'

type WireProps = {
  instanceId: string
}

export const Wire = ({ instanceId: id }: WireProps): React.ReactElement | null => {
  const { store: { elements } } = useGraphManager()

  if (!elements[id]) {
    console.error(`Element '${id}' does not exist.'`)
    return null
  }

  const element = elements[id]

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

  return <div className="absolute bg-darkgreen z-10" style={{ left: min.x, top: -max.y, width, height }}></div>
}

const isWire = (element: Glasshopper.Element.Base): element is Glasshopper.Element.Wire => {
  return element.template.type === 'wire'
}