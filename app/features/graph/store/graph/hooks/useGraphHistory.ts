import { useAppSelector } from '$'
import { graphSelectors } from '../graphSlice'

export const useGraphHistory = (): ReturnType<typeof graphSelectors['selectGraphHistory']> => {
  return useAppSelector(graphSelectors.selectGraphHistory)
}
