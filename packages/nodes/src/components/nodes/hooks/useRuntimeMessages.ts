import { useRef } from 'react'
import type { NodeSolutionData } from '@nodepen/core'
import { useStore } from '$'

/**
 * Returns the latest runtime messages for the given document node.
 * @remarks While solution lifecycle status is `expired`, returns a cached version of the previous solution's messages.
 */
export const useRuntimeMessages = (nodeInstanceId: string): NodeSolutionData['nodeRuntimeData']['messages'] => {
  const previousMessages = useRef<NodeSolutionData['nodeRuntimeData']['messages']>([])

  return useStore((state) => {
    if (state.lifecycle.solution === 'expired') {
      return previousMessages.current
    }

    const nodeSolutionData = state.solution.nodeSolutionData.find(
      (nodeSolution) => nodeSolution.nodeInstanceId === nodeInstanceId
    )

    if (!nodeSolutionData) {
      return []
    }

    const nodeRuntimeMessages = nodeSolutionData.nodeRuntimeData.messages

    previousMessages.current = nodeRuntimeMessages

    return nodeRuntimeMessages
  })
}
