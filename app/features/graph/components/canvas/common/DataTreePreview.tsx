import React from 'react'
import { NodePen } from 'glib'
import { Typography } from 'features/common'
import { flattenDataTree } from '@/features/graph/utils'

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
  const values = flattenDataTree(tree ?? {})

  return (
    <div className="w-full p-2 flex flex-col justify-start items-center">
      <Typography.Data size="sm" color="dark">
        {details}
      </Typography.Data>
      {values.map(({ value }, i) => (
        <Typography.Data key={`${prefix}${i}`} size="sm" color="dark">
          {value.toString()}
        </Typography.Data>
      ))}
      {/* {Object.entries(tree ?? {}).map(([path, values]) => (
        <div key={`${prefix}`} className="w-full ">
          <div key={`${prefix}${path}`} className="w-full h-8 flex items-center justify-end">
            {path}
          </div>
          {values.map((value, i) => (
            <div key={`${prefix}${path}-value-${i}`} className="w-full h-8 flex items-center">
              <div className="w-8 h-8 flex justify-center items-center">{i}</div>
              <div className="h-8 flex-grow flex justify-end items-center overflow-hidden whitespace-nowrap">
                {value.value}
              </div>
            </div>
          ))}
        </div>
      ))} */}
    </div>
  )
}
