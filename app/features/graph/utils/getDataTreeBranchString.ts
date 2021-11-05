import { NodePen } from 'glib'
import { getDataTreePathString } from '.'

export const getDataTreeBranchString = (branch: NodePen.DataTreeBranch): string => {
  const path = getDataTreePathString(branch.path)

  return `${path} ( N = ${branch.data.length} )`
}
