import type * as NodePen from '@nodepen/core'

/**
 * Given a data tree, return a single value if there is only one value. Otherwise, return `undefined`
 */
export const tryGetSingleValue = (data?: NodePen.DataTree): NodePen.DataTreeValue | undefined => {
  return data?.stats?.treeStructure === 'single' ? data.branches[0]?.values[0] : undefined
}
