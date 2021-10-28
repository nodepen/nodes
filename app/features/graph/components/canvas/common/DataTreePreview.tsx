import React from 'react'
import { NodePen } from 'glib'
import { Typography } from 'features/common'
import { flattenDataTree, getDataTreePreviewStrings } from '@/features/graph/utils'

type DataTreePreviewProps = {
  elementId: string
  parameterId: string
  tree?: NodePen.DataTree
  details?: string
}

export const DataTreePreview = ({
  elementId,
  parameterId,
  tree,
  details,
}: DataTreePreviewProps): React.ReactElement => {
  const prefix = `${elementId}-${parameterId}-data-`

  const entries = getDataTreePreviewStrings(tree ?? {})

  return (
    <div className="w-full p-2 flex flex-col justify-start items-center">
      <Typography.Data size="sm" color="dark">
        {details}
      </Typography.Data>
      {entries.map((entry, i) => (
        <Typography.Data key={`${prefix}-value-${i}`} size="sm" color="dark">
          {entry}
        </Typography.Data>
      ))}
    </div>
  )
}
