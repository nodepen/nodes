import { NodePen } from 'glib'

export const flattenDataTree = (tree: NodePen.DataTree): NodePen.DataTreeValue<NodePen.SolutionValueType>[] => {
  return Object.values(tree).reduce((all, current) => [...all, ...current], [])
}
