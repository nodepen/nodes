import React from 'react'
import { Grasshopper } from 'glib'
import { Typography } from '@/features/common'
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
        <Typography.Label size="lg" color="darkgreen">
          {title}
        </Typography.Label>
      </div>
      <div className="ml-10 mr-2 mb-5">
        <Typography.Label size="sm" color="darkgreen">
          {description}
        </Typography.Label>
      </div>
    </>
  )
}
