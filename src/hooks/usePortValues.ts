import type * as NodePen from '@nodepen/core'
import { useDispatch, useStore } from '$'
import { useCallback, useEffect } from 'react'
import { useAsyncMemo } from '@/hooks'

/**
 * Given a reference to a specific port, return its user-defined values or its current solution values.
 * @remarks Returns first value found, in that order, or `null` if none exist.
 * @param nodeInstanceId
 * @param portInstanceId
 */
export const usePortValues = (nodeInstanceId: string, portInstanceId: string): NodePen.DataTree | null => {
  const { apply } = useDispatch()

  // The solution id associated with the latest values
  const { solutionId, solutionStatus } = useStore((state) => {
    return {
      solutionId: state.solution.solutionId,
      solutionStatus: state.lifecycle.solution,
    }
  })

  const getLatestValues = useCallback(async (): Promise<NodePen.DataTree | null> => {
    // Use locally-set values, if available
    const documentNode = useStore.getState().document.nodes[nodeInstanceId]
    const documentNodeValues = documentNode?.values?.[portInstanceId]

    if (documentNodeValues && documentNodeValues.stats.treeStructure !== 'empty') {
      // Return locally-set values
      return documentNodeValues
    }

    // Use previously cached solution values, if available
    const nodeSolutionData = useStore
      .getState()
      .solution.nodeSolutionData.find(({ nodeInstanceId: id }) => id === nodeInstanceId)
    const portSolutionData = nodeSolutionData?.portSolutionData?.find(({ portInstanceId: id }) => id === portInstanceId)
    const portSolutionDataValues = portSolutionData?.dataTree

    if (portSolutionDataValues) {
      // Return cached values
      return portSolutionDataValues
    }

    // Fetch values with provided callback, if possible
    const { getPortSolutionData } = useStore.getState().callbacks

    if (!getPortSolutionData) {
      // No callback provided
      return null
    }

    const { dataTree } = (await getPortSolutionData(nodeInstanceId, portInstanceId)) ?? {}

    if (!dataTree) {
      return null
    }

    return dataTree
  }, [solutionId, nodeInstanceId, portInstanceId])

  const cacheKey = `${solutionId}:${solutionStatus}:${nodeInstanceId}:${portInstanceId}`

  const { value, isLoading: _isLoading } = useAsyncMemo(cacheKey, getLatestValues)

  const cacheValue = useStore.getState().cache.portSolutionData[cacheKey]

  // Cache value in store
  useEffect(() => {
    if (!value || solutionStatus === 'expired') {
      return
    }

    const nodeSolutionData = useStore
      .getState()
      .solution.nodeSolutionData.find(({ nodeInstanceId: id }) => id === nodeInstanceId)

    if (!nodeSolutionData) {
      console.log(`🐍 Attempted to cache results for node that does not exist: [${nodeInstanceId}]`)
      console.log(value)
      return
    }

    const portSolutionData = nodeSolutionData.portSolutionData.find(({ portInstanceId: id }) => id === portInstanceId)

    if (portSolutionData) {
      // Value has already been cached
      return
    }

    // Cache value in store
    apply((state) => {
      const solutionData: NodePen.PortSolutionData = {
        portInstanceId,
        dataTree: value,
      }

      state.solution.nodeSolutionData
        .find(({ nodeInstanceId: id }) => id === nodeInstanceId)
        ?.portSolutionData?.push({
          portInstanceId,
          dataTree: value,
        })

      state.cache.portSolutionData[cacheKey] = solutionData
    })
  }, [value])

  if (solutionStatus === 'expired') {
    return null
  }

  return cacheValue?.dataTree ?? value
}
