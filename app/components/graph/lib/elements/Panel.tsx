import React, { useMemo } from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { Grip, DataTree } from './common'
import { Data } from '~/../lib/dist/glasshopper'

type PanelProps = {
  instanceId: string
}

export const Panel = ({ instanceId: id }: PanelProps): React.ReactElement => {
  const {
    store: { elements, solution },
  } = useGraphManager()

  const panel = elements[id] as Glasshopper.Element.Panel

  const source = panel.current.sources['input'].length > 0 ? panel.current.sources['input'][0] : undefined
  const values: Glasshopper.Data.DataTree = source
    ? elements[source.element].template.type === 'static-parameter'
      ? (elements[source.element].current as any).values
      : (elements[source.element].current as any).values[source.parameter]
    : undefined

  if (!elements[id]) {
    console.error(`Element '${id}' does not exist.'`)
    return null
  }

  const { current } = panel

  const [dx, dy] = current.position

  return (
    <div className="absolute flex flex-row" style={{ left: dx, top: -dy }}>
      <div id="grip-column" className="w-2 h-64 flex flex-col justify-center z-20">
        <Grip source={{ element: id, parameter: 'input' }} />
      </div>
      <div className="w-8 h-64 bg-light z-30"></div>
      <div className="w-40 h-64 bg-green">
        {values ? <DataTree data={values} label={(elements[source.element].template as any).nickname} /> : 'No data'}
      </div>
      <div className="w-64 h-64 bg-pale" />
    </div>
  )
}
