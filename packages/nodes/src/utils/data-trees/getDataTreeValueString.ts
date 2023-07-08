import type * as NodePen from '@nodepen/core'

export const getDataTreeValueString = (dataTreeValue?: NodePen.DataTreeValue): string => {
  if (!dataTreeValue) {
    return 'undefined'
  }

  return dataTreeValue.description
}
