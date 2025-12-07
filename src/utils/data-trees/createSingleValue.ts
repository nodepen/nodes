import type * as NodePen from '@/types'

export const createSingleValue = (value: string, valueType: NodePen.DataTreeValueType): NodePen.DataTree => {
  return {
    branches: [
      {
        order: 0,
        path: '{0}',
        values: [
          {
            type: valueType,
            description: value.toString(),
            order: 0,
            value: value.toString(),
          },
        ],
      },
    ],
    stats: {
      branchCount: 1,
      branchValueCountDomain: [1, 1],
      treeStructure: 'single',
      valueTypes: [valueType],
      valueCount: 1,
    },
  }
}