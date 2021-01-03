import React from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import * as Parameter from './parameters'

type StaticComponentProps = {
  instanceId: string
}

export const StaticParameter = ({ instanceId: id }: StaticComponentProps): React.ReactElement | null => {
  const { store: { elements } } = useGraphManager()

  if (!elements[id] || elements[id].template.type !== 'static-parameter') {
    console.error(`Mismatch with element '${id}' and attempted type 'static-parameter'`)
    return null
  }

  const parameter = elements[id] as Glasshopper.Element.StaticParameter

  const { template, current } = parameter
  const [dx, dy] = current.position

  return (
    <div className="absolute flex flex-row justify-center w-48" style={{ left: dx, top: -dy }}>
      {(() => {
        switch (parameter.template.name.toLowerCase()) {
          case 'number': {
            return <Parameter.Number parameter={parameter} />
          }
          default: {
            return `${template.name} (${dx}, ${dy})`
          }
        }
      })()}
    </div>
  )
}