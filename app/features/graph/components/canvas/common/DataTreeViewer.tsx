import React from 'react'
import { NodePen } from 'glib'
import { Typography } from '@/features/common'
import { getDataTreeValueString } from '@/features/graph/utils'
import { useCameraDispatch } from '@/features/graph/store/camera/hooks'

type DataTreeViewerProps = {
  tree: NodePen.DataTree
}

export const DataTreeViewer = ({ tree }: DataTreeViewerProps): React.ReactElement => {
  const { setZoomLock } = useCameraDispatch()

  return (
    <div
      className="w-full h-full overflow-y-auto no-scrollbar"
      onPointerEnter={() => setZoomLock(true)}
      onPointerLeave={() => setZoomLock(false)}
    >
      {Object.entries(tree).map(([path, branch]) => {
        return (
          <>
            <div
              key={`data-tree-${path}-header`}
              className="w-full h-8 mb-1 pr-2 bg-green rounded-sm flex justify-end items-center sticky top-0"
            >
              <Typography.Data size="md" color="darkgreen" align="right">
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
    <div className="w-full h-6 mb-1 flex justify-start items-center">
      <div className="w-8 h-full pl-1 mr-1 flex items-center bg-green rounded-sm">
        <Typography.Data size="sm" color="darkgreen">
          {index.toString()}
        </Typography.Data>
      </div>
      <div className="h-full flex-grow pr-1 bg-green rounded-sm flex justify-end items-center overflow-hidden whitespace-nowrap">
        <Typography.Data size="sm" color="dark" align="right">
          {record}
        </Typography.Data>
      </div>
    </div>
  )
}
