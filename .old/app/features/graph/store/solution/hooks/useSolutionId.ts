import { useAppSelector } from '$'
import { solutionSelectors } from '../solutionSlice'

export const useSolutionId = (): ReturnType<typeof solutionSelectors['selectCurrentSolutionId']> => {
  return useAppSelector(solutionSelectors.selectCurrentSolutionId)
}
