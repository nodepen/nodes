import { useAppSelector } from '$'
import { graphSelectors } from '../graphSlice'

export const useGraphSelection = (): ReturnType<typeof graphSelectors['selectSelection']> => {
  return useAppSelector(graphSelectors.selectSelection)
}
