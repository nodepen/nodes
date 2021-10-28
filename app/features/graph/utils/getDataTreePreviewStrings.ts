import { NodePen } from 'glib'
import { getDataTreeValueString } from '.'

export const getDataTreePreviewStrings = (tree: NodePen.DataTree, limit = 10): string[] => {
  const branchPaths = Object.keys(tree)

  if (branchPaths.length === 0) {
    return []
  }

  const delimiter = '...'

  if (branchPaths.length === 1) {
    const values = Object.values(tree)[0]

    if (values.length <= limit) {
      return values.map((value) => getDataTreeValueString(value))
    } else {
      const truncatedValues = [...values.slice(0, limit - 2), values[values.length - 1]]
      const truncatedValueStrings = truncatedValues.map((value) => getDataTreeValueString(value))

      return [
        ...truncatedValueStrings.slice(0, limit - 2),
        delimiter,
        truncatedValueStrings[truncatedValueStrings.length - 1],
      ]
    }
  }

  if (branchPaths.length > 1) {
    const branches = Object.entries(tree)

    const truncatedBranches =
      branches.length <= limit ? branches : [...branches.slice(0, limit - 2), branches[branches.length - 1]]
    const truncatedBranchStrings = truncatedBranches.map(([path, values]) => `${path} ( N = ${values.length} )`)

    return branches.length <= limit
      ? truncatedBranchStrings
      : [
          ...truncatedBranchStrings.slice(0, limit - 2),
          delimiter,
          truncatedBranchStrings[truncatedBranchStrings.length - 1],
        ]
  }

  console.log('🐍 Failed to parse branch as string!')

  return []
}
