import { NodePen } from 'glib'
import { getDataTreePathString } from '../../../utils'

/**
 * Convert flat list of branches to NodePen DataTree object representation
 */
export const dataBranchesToDataTree = (
  values: { path: number[]; data: { type: any; value: any }[] }[]
): NodePen.DataTree => {
  const tree: NodePen.DataTree = {}

  for (const { path, data } of values) {
    const pathKey = getDataTreePathString(path)
    tree[pathKey] = data
  }

  return tree
}
