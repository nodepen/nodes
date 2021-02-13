import React from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { Grip, DataTree } from './common'

type PanelProps = {
  instanceId: string
}

export const Panel = ({ instanceId: id }: PanelProps): React.ReactElement => {
  const {
    store: { elements, solution },
  } = useGraphManager()

  const panel = elements[id] as Glasshopper.Element.Panel

  const source = panel.current.sources['input'].length > 0 ? panel.current.sources['input'][0] : undefined

  const getValues = (): Glasshopper.Data.DataTree | undefined => {
    if (!source) {
      return undefined
    }

    const element = elements[source.element]

    switch (element.template.type) {
      case 'static-parameter': {
        const parameter = element as Glasshopper.Element.StaticParameter
        return parameter.current.values
      }
      case 'static-component': {
        const component = element as Glasshopper.Element.StaticComponent
        return component.current.values[source.parameter]
      }
      case 'number-slider': {
        const slider = element as Glasshopper.Element.NumberSlider
        return slider.current.values
      }
    }
  }

  const values = getValues()

  if (!elements[id]) {
    console.error(`Element '${id}' does not exist.'`)
    return null
  }

  const { current } = panel

  const [dx, dy] = current.position

  const label = source ? (elements[source.element].template as any).nickname : 'N/A'

  return (
    <div className="absolute flex flex-row" style={{ left: dx, top: -dy - 128 }}>
      <div id="grip-column" className="w-2 h-64 flex flex-col justify-center z-20">
        <Grip source={{ element: id, parameter: 'input' }} />
      </div>
      <div className={`w-8 h-64 bg-light border-2 border-dark rounded-tl-md rounded-bl-md shadow-osm z-30`} />
      <div
        className={`w-40 h-64 p-2 pt-1 bg-pale border-2 border-green rounded-tr-md rounded-br-md overflow-hidden`}
        style={{ transform: 'translateY(2px)' }}
      >
        {values ? (
          <DataTree data={values} label={label} />
        ) : (
          <div className="w-full h-full mt-1 rounded-sm border-2 border-dashed border-green" />
        )}
      </div>
    </div>
  )
}
