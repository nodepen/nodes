import React, { useState } from 'react'
import { Glasshopper } from 'glib'
import { useGraphManager } from '@/context/graph'
import { ParameterIcon } from './parameters'
import { Details } from './common'

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

  const [[overPanel, overDetails], setHovers] = useState<[boolean, boolean]>([false, false])

  return (
    <div className="absolute flex flex-row justify-center w-48" style={{ left: dx - 96, top: -dy }}>
      <div className="flex flex-col items-center">
        <div
          className="flex flex-row justify-center items-center relative z-20"
          onPointerEnter={() => setHovers(([panel, details]) => [true, details])}
          onPointerLeave={() => setHovers(([panel, details]) => [false, details])}
        >
          <div className="absolute z-0" style={{ left: '-12.5px', transform: 'translate(2px, 1.5px)' }}>
            <ParameterIcon />
          </div>
          <div className="h-8 pt-4 pb-4 flex flex-row items-center border-2 border-dark rounded-md bg-light shadow-osm relative z-20">
            <div className="absolute z-20" style={{ left: '-12.5px' }}>
              <ParameterIcon />
            </div>
            <div className="ml-6 mr-6 font-panel text-base font-bold text-dark z-10" style={{ left: '0' }}>
              {template.nickname.toLowerCase()}
            </div>
          </div>
        </div>
        {overPanel || overDetails ? (
          <div
            className="flex flex-col w-48 overflow-hidden z-10" style={{ transform: 'translate(0, -18px)' }}
            onPointerEnter={() => setHovers(([panel, details]) => [panel, true])}
            onPointerLeave={() => setHovers(([panel, details]) => [panel, false])}
          >
            <Details>
              {Object.keys(current.values).length > 0
                ? (
                  <div>Data!</div>
                )
                : (
                  <button className="block w-full mt-1 p-1 text-center border-2 rounded-sm border-dashed border-green text-xs font-bold text-green hover:border-darkgreen hover:text-darkgreen">Set value</button>
                )}
            </Details>
            {/*<div className="w-full p-2">
              <h3 className="block w-full mt-1 font-sans font-normal text-sm text-darkgreen">
              {template.name}
            </h3>
            <p className="block w-full font-sans font-light text-xs text-darkgreen">
              {template.description}
            </p>*/}
          </div>
        ) : null}
      </div>
    </div>
  )
}