import { useAppSelector } from '$'
import { graphSelectors } from '../graphSlice'

export const useVisibilityRegistry = (): ReturnType<typeof graphSelectors['selectVisibilityRegistry']> => {
  return useAppSelector(graphSelectors.selectVisibilityRegistry)
}
