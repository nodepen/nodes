import { useGraphSelection } from 'features/graph/store/graph/hooks'

export const useSelectionStatus = (id: string): boolean => {
  const selection = useGraphSelection()
  return selection.includes(id)
}
