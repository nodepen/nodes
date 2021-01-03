import React, { useState } from 'react'
import { Glasshopper } from 'glib'
import { ParameterIcon } from './ParameterIcon'

type NumberParameterProps = {
  parameter: Glasshopper.Element.StaticParameter
}

export const NumberParameter = ({ parameter }: NumberParameterProps): React.ReactElement => {
  const { template, current } = parameter

  const [detailsVisible, setDetailsVisible] = useState(false)

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row justify-center items-center relative z-20">
        <div className="absolute z-0" style={{ left: '-12.5px', transform: 'translate(2px, 1.5px)' }}>
          <ParameterIcon />
        </div>
        <button
          className="h-8 pt-4 pb-4 flex flex-row items-center border-2 border-dark rounded-md bg-light shadow-osm relative z-20"
          onClick={() => setDetailsVisible((current) => !current)}
        >
          <div className="absolute z-20" style={{ left: '-12.5px' }}>
            <ParameterIcon />
          </div>
          <div className="ml-6 mr-6 font-panel text-base text-dark z-10" style={{ left: '0' }}>
            {template.nickname}
          </div>
        </button>
      </div>
      { detailsVisible ? (
        <div className="flex flex-col bg-pale w-48 border-2 border-green rounded-md overflow-hidden z-10" style={{ transform: 'translate(0, -18px)' }}>
          <div className="w-full h-8 bg-green flex flex-col justify-end relative overflow-visible">
            <div className="w-full h-6 pl-2 pr-2 absolute flex flex-row justify-center items-center" style={{ bottom: '-12px' }}>
              <div className={`h-3 flex-grow rounded-full border-2 border-green bg-pale`} />
            </div>

          </div>

          <div className="w-full p-2">
            {/* <h3 className="block w-full mt-1 font-sans font-normal text-sm text-darkgreen">
              {template.name}
            </h3>
            <p className="block w-full font-sans font-light text-xs text-darkgreen">
              {template.description}
            </p> */}
            {Object.keys(current.values).length > 0
              ? (
                <div>Data!</div>
              )
              : (
                <button className="block w-full mt-1 p-1 text-center border-2 rounded-sm border-dashed border-green text-xs font-bold text-green hover:border-darkgreen hover:text-darkgreen">Set value</button>
              )}
          </div>
        </div>
      ) : null}
    </div>
  )
}