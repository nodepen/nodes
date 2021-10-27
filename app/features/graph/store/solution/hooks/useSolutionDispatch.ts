import { useAppDispatch } from '$'
import { solutionActions } from '../solutionSlice'
import { Payload } from '../types'

/* eslint-disable-next-line */
export const useSolutionDispatch = () => {
  const dispatch = useAppDispatch()

  return {
    expireSolution: () => {
      dispatch(solutionActions.expireSolution())
    },
    updateSolution: (data: Payload.UpdateSolutionPayload) => {
      dispatch(solutionActions.updateSolution(data))
    },
    tryApplySolutionManifest: (data: Payload.ApplySolutionManifestPayload) => {
      dispatch(solutionActions.tryApplySolutionManifest(data))
    },
    tryApplySolutionValues: (data: Payload.ApplySolutionValuesPayload) => {
      dispatch(solutionActions.tryApplySolutionValues(data))
    },
  }
}
