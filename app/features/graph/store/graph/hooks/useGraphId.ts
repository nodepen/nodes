import { useAppSelector } from '$'
import { graphSelectors } from '../graphSlice'

export const useGraphId = (): ReturnType<typeof graphSelectors['selectGraphId']> => {
  return useAppSelector(graphSelectors.selectGraphId)
}
