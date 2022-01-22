import { useAppSelector } from '$'
import { solutionSelectors } from '../solutionSlice'

export const useSolutionPhase = (): ReturnType<typeof solutionSelectors['selectCurrentSolutionPhase']> => {
  return useAppSelector(solutionSelectors.selectCurrentSolutionPhase)
}
