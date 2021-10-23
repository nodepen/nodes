import { useAppSelector } from '$'
import { solutionSelectors } from '../solutionSlice'

export const useSolutionValues = (): ReturnType<typeof solutionSelectors['selectCurrentSolutionValues']> => {
  return useAppSelector(solutionSelectors.selectCurrentSolutionValues)
}
