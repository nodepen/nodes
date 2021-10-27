import React from 'react'
import { DataTreePreview } from './DataTreePreview'
import { useParameterValues } from '../../../hooks'

type DataTreeContainerProps = {
  elementId: string
  parameterId: string
}

const DataTreeContainer = ({ elementId, parameterId }: DataTreeContainerProps): React.ReactElement => {
  const tree = useParameterValues(elementId, parameterId)

  return (
    <div className="w-full rounded-md bg-pale">
      <DataTreePreview tree={tree} elementId={elementId} parameterId={parameterId} />
    </div>
  )
}

export default React.memo(DataTreeContainer)
