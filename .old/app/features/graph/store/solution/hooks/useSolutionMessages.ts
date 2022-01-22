import { useAppSelector } from '$'
import { solutionSelectors } from '../solutionSlice'

export const useSolutionMessages = (): ReturnType<typeof solutionSelectors['selectCurrentSolutionMessages']> => {
  return useAppSelector(solutionSelectors.selectCurrentSolutionMessages)
}
