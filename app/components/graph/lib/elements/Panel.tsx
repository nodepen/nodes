import React from 'react'
import dynamic from 'next/dynamic'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { Grip, DataTree } from './common'
// import { PanelScene } from './../scene'

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

  const label = source ? (elements[source.element].template as any).nickname : 'N/A'
  const showScene = label === 'Pt'

  const Canvas = dynamic(import('./scene/Panel'), { ssr: false })

  return (
    <div className="absolute flex flex-row" style={{ left: dx, top: -dy }}>
      <div id="grip-column" className="w-2 h-64 flex flex-col justify-center z-20">
        <Grip source={{ element: id, parameter: 'input' }} />
      </div>
      <div className={`w-8 h-64 bg-light border-2 border-dark rounded-tl-md rounded-bl-md shadow-osm z-30`} />
      <div
        className={`w-40 h-64 p-2 pt-1 bg-pale border-2 border-green ${
          showScene ? '' : 'rounded-tr-md rounded-br-md'
        } overflow-hidden`}
        style={{ transform: 'translateY(2px)' }}
      >
        {values ? (
          <DataTree data={values} label={label} />
        ) : (
          <div className="w-full h-full mt-1 rounded-sm border-2 border-dashed border-green" />
        )}
      </div>
      <div
        className="w-64 h-64 bg-pale border-2 border-l-0 border-green rounded-tr-md rounded-br-md"
        style={{ opacity: showScene && values ? 1 : 0, transform: 'translateY(2px)' }}
      >
        {showScene ? (
          <Canvas points={values && showScene ? Object.values(values)[0].map((v) => v.data as any) : []} />
        ) : null}
      </div>
    </div>
  )
}
