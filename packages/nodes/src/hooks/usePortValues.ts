import type * as NodePen from '@nodepen/core'
import { useDispatch, useStore } from '$'
import { useEffect, useRef, useDeferredValue } from 'react'

/**
 * Given a reference to a specific port, return its user-defined values or its current solution values.
 * @remarks Returns first value found, in that order, or `null` if none exist.
 * @param nodeInstanceId
 * @param portInstanceId
 */
export const usePortValues = (nodeInstanceId: string, portInstanceId: string): NodePen.DataTree | null => {
  const getPortSolutionData = useStore((state) => state.callbacks.getPortSolutionData)

  const { apply } = useDispatch()

  // The solution id associated with the latest values
  const solutionId = useStore((state) => state.solution.solutionId)

  // Values set directly on input ports in the current document
  const localValues = useStore((state) => {
    const node = state.document.nodes[nodeInstanceId]

    if (!node) {
      return null
    }

    const localValues = node.values[portInstanceId]

    if (!localValues || Object.keys(localValues).length === 0) {
      return null
    }

    return localValues
  })

  // Node solution data as-computed and stored in the current solution
  const nodeSolutionData = useStore((state) => {
    return state.solution.nodeSolutionData.find(({ nodeInstanceId: id }) => id === nodeInstanceId)
  })

  if (!nodeSolutionData) {
    return null
  }

  // Port solution data as-computed and stored in the current solution
  const portSolutionData = nodeSolutionData?.portSolutionData.find(({ portInstanceId: id }) => id === portInstanceId)

  if (!portSolutionData && !!getPortSolutionData) {
    const requestSolutionId = solutionId

    getPortSolutionData(nodeInstanceId, portInstanceId).then((result) => {
      apply((state) => {
        if (state.solution.solutionId !== requestSolutionId) {
          return
        }

        const currentNodeSolutionData = state.solution.nodeSolutionData.find(
          ({ nodeInstanceId: id }) => id === nodeInstanceId
        )

        if (!currentNodeSolutionData) {
          return
        }

        currentNodeSolutionData.portSolutionData.push(result)
      })
    })
  }

  return localValues ?? portSolutionData?.dataTree ?? null
}
