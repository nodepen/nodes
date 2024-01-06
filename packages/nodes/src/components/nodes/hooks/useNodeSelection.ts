import { useStore } from '$'

export const useNodeSelection = (nodeInstanceId: string): boolean => {
  const documentSelection = useStore((state) => state.registry.selection.nodes)
  const isSelected = documentSelection.includes(nodeInstanceId)

  return isSelected
}
