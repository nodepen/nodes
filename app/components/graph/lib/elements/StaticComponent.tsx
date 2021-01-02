import React from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'

type StaticComponentProps = {
  instanceId: string
}

export const StaticComponent = ({ instanceId: id }: StaticComponentProps): React.ReactElement | null => {
  const { store: { elements } } = useGraphManager()

  if (!elements[id] || elements[id].template.type !== 'static-component') {
    console.error(`Mismatch with element '${id}' and attempted type 'static-component'`)
    return null
  }

  const { template, current } = elements[id] as Glasshopper.Element.StaticComponent

  const [x, y] = current.position

  return null
}