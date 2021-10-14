import { Grasshopper } from 'glib'
import React from 'react'

type StaticComponentDetailsProps = {
  template: Grasshopper.Component
}

export const StaticComponentDetails = ({ template }: StaticComponentDetailsProps): React.ReactElement => {
  const { icon, nickname, description } = template

  return (
    <>
      <div className="w-full h-12 flex items-center justify-start">
        <img className="ml-2 mr-4" src={`data:image/png;base64,${icon}`} alt={`Icon for the ${nickname} component.`} />
        <h3 className="text-lg text-darkgreen font-medium">{nickname}</h3>
      </div>
      <p className="ml-12 mr-2 mb-4 text-darkgreen text-sm">{description}</p>
    </>
  )
}
