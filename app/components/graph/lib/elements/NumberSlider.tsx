import React from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { Grip, DataTree } from './common'

type NumberSliderProps = {
  instanceId: string
}

export const NumberSlider = ({ instanceId: id }: NumberSliderProps): React.ReactElement => {
  const {
    store: { elements, solution },
  } = useGraphManager()

  const slider = elements[id] as Glasshopper.Element.NumberSlider

  const { position, domain, precision, value } = slider.current

  const [dx, dy] = position

  return (
    <div className="absolute flex flex-row" style={{ left: dx, top: -dy }}>
      <div className="w-36 h-12 rounded-sm border-2 border-dark flex flex-row items-center">
        <p>{domain}</p>
        <p>{value}</p>
        <p>(.{precision})</p>
      </div>
    </div>
  )
}
