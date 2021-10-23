import { useAppDispatch } from '$'
import { newGuid } from '@/features/graph/utils'
import { solutionActions } from '../solutionSlice'

/* eslint-disable-next-line */
export const useSolutionDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    expireSolution: () => {
      const newSolutionId = newGuid()

      // Expire solution values
      dispatch(solutionActions.expireSolution({ id: newSolutionId }))

      // Perform any related graph cleanup actions
    },
  }
}
