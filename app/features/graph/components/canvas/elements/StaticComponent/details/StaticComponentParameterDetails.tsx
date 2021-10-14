import React from 'react'
import { Grasshopper } from 'glib'
import { ParameterIcon } from 'features/graph/components/canvas/common'

type StaticComponentParameterDetailsProps = {
  template: Grasshopper.Parameter
}

export const StaticComponentParameterDetails = ({
  template,
}: StaticComponentParameterDetailsProps): React.ReactElement => {
  const { name, nickname, description, type } = template

  const title = `${name}  (${nickname})`

  return (
    <>
      <div className="w-full h-12 flex items-center justify-start">
        <div className="w-12 h-full flex items-center justify-center" style={{ transform: 'translateX(-3px)' }}>
          <ParameterIcon size="sm" type={type} />
        </div>
        <h3 className="text-lg text-darkgreen font-medium">{title}</h3>
      </div>
      <p className="ml-12 mr-2 mb-4 text-darkgreen text-sm">{description}</p>
    </>
  )
}
