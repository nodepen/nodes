import { useAppDispatch } from '$'
import { solutionActions } from '../solutionSlice'

/* eslint-disable-next-line */
export const useSolutionDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    expireSolution: (newSolutionId: string) => {
      dispatch(solutionActions.expireSolution({ id: newSolutionId }))
    },
  }
}
