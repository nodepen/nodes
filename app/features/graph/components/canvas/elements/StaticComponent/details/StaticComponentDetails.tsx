import React from 'react'
import { Grasshopper } from 'glib'
import { Typography } from '@/features/common'

type StaticComponentDetailsProps = {
  template: Grasshopper.Component
}

export const StaticComponentDetails = ({ template }: StaticComponentDetailsProps): React.ReactElement => {
  const { icon, nickname, description } = template

  return (
    <>
      <div className="w-full h-12 flex items-center justify-start">
        <img className="ml-2 mr-4" src={`data:image/png;base64,${icon}`} alt={`Icon for the ${nickname} component.`} />
        <Typography.Label size="lg" color="darkgreen">
          {nickname}
        </Typography.Label>
      </div>
      <div className="ml-12 mr-2 mb-4">
        <Typography.Label size="sm" color="darkgreen">
          {description}
        </Typography.Label>
      </div>
    </>
  )
}
