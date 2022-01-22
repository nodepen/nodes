import React from 'react'
import { DataTreePreview } from './DataTreePreview'
import { useParameterValues } from '../../../hooks'
import { useSolutionPhase } from 'features/graph/store/solution/hooks'

type DataTreeContainerProps = {
  elementId: string
  parameterId: string
}

const DataTreeContainer = ({ elementId, parameterId }: DataTreeContainerProps): React.ReactElement => {
  const [tree, details] = useParameterValues(elementId, parameterId)
  const phase = useSolutionPhase()

  return (
    <div className="w-76 rounded-md bg-pale">
      <DataTreePreview
        tree={tree}
        details={details}
        loading={phase !== 'idle'}
        elementId={elementId}
        parameterId={parameterId}
      />
    </div>
  )
}

export default React.memo(DataTreeContainer)
