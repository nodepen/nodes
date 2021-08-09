import { useAppSelector } from '$'
import { graphSelectors } from '../graphSlice'

export const useGraphSolution = (): ReturnType<typeof graphSelectors['selectSolution']> => {
  return useAppSelector(graphSelectors.selectSolution)
}
