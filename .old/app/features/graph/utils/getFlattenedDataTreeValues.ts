import { NodePen } from 'glib'

export const getFlattenedDataTreeValues = (
  tree: NodePen.DataTree
): NodePen.DataTreeValue<NodePen.SolutionValueType>[] => {
  return Object.entries(tree).reduce((all, [_path, values]) => {
    return [...all, ...values]
  }, [] as NodePen.DataTreeValue<NodePen.SolutionValueType>[])
}
