import React, { useState } from 'react'
import { NodePen } from 'glib'
import { Typography } from '@/features/common'
import { getDataTreeValueString } from '@/features/graph/utils'

type DataTreeViewerProps = {
  tree: NodePen.DataTree
}

export const DataTreeViewer = ({ tree }: DataTreeViewerProps): React.ReactElement => {
  return (
    <div className="w-full h-full p-2 flex flex-col justify-start items-center rounded-sm border-2 border-dark overflow-y-auto no-scrollbar">
      {Object.entries(tree).map(([path, branch]) => {
        return (
          <>
            <div key={`data-tree-${path}-header`} className="w-full h-8 flex justify-end items-center">
              <Typography.Data size="md" color="dark">
                {path}
              </Typography.Data>
            </div>
            {branch.map((value, i) => (
              <DataTreeValue key={`data-tree-${path}-value-${i}`} value={value} index={i} />
            ))}
          </>
        )
      })}
    </div>
  )
}

type DataTreeValueProps = {
  index: number
  value: NodePen.DataTreeValue<NodePen.SolutionValueType>
}

const DataTreeValue = ({ index, value }: DataTreeValueProps): React.ReactElement => {
  const record = getDataTreeValueString(value)

  return (
    <div
      className="w-full h-6 pl-2 pr-2 flex justify-start items-center"
      style={{ paddingTop: '2px', paddingBottom: '2px' }}
    >
      <div className="w-8 h-full flex items-center justify-start border-r-2 border-dark">
        <Typography.Data size="sm" color="dark">
          {index.toString()}
        </Typography.Data>
      </div>
      <div className="h-full flex-grow flex justify-end items-center">
        <Typography.Data size="sm" color="dark">
          {record}
        </Typography.Data>
      </div>
    </div>
  )
}
