import { useAppSelector } from '$'
import { solutionSelectors } from '../solutionSlice'

export const useSolutionMetadata = (): ReturnType<typeof solutionSelectors['selectCurrentSolutionMetadata']> => {
  return useAppSelector(solutionSelectors.selectCurrentSolutionMetadata)
}
