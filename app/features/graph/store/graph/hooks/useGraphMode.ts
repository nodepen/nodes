import { useAppSelector } from '$'
import { graphSelectors } from '../graphSlice'

export const useGraphMode = (): ReturnType<typeof graphSelectors['selectMode']> => {
  return useAppSelector(graphSelectors.selectMode)
}
