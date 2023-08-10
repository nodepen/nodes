import type { NodeSolutionData } from '@nodepen/core'
import { useStore } from '$'

export const useRuntimeMessages = (nodeInstanceId: string): NodeSolutionData['nodeRuntimeData']['messages'] => {
  return useStore(
    (state) =>
      state.solution.nodeSolutionData.find((nodeSolution) => nodeSolution.nodeInstanceId === nodeInstanceId)
        ?.nodeRuntimeData?.messages ?? []
  )
}
