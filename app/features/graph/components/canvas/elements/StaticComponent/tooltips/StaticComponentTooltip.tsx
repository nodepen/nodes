import { Grasshopper } from 'glib'
import React from 'react'

type StaticComponentTooltipProps = {
  template: Grasshopper.Component
}

export const StaticComponentTooltip = ({ template }: StaticComponentTooltipProps): React.ReactElement => {
  const { icon, nickname, description } = template

  return (
    <div style={{ minWidth: 250, width: 'min-content' }}>
      <div className="w-full p-2 flex flex-col items-start rounded-md bg-green">
        <div className="w-full h-12 flex items-center justify-start">
          <img
            className="ml-2 mr-4"
            src={`data:image/png;base64,${icon}`}
            alt={`Icon for the ${nickname} component.`}
          />
          <h3 className="text-lg text-darkgreen font-medium">{nickname}</h3>
        </div>
        <p className="ml-12 mr-2 mb-4 text-darkgreen text-sm">{description}</p>
      </div>
    </div>
  )
}
