import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { useCallback, useEffect } from 'react'
import { useAsyncMemo } from '@/hooks'
import { useSpeckleObjectLoader } from '@/context'
import { lowercaseFirstLetterDeep } from '@/utils/common/lowercaseFirstLetterDeep'

/**
 * Given a reference to a specific port, return its user-defined values or its current solution values.
 * @remarks Returns first value found, in that order, or `null` if none exist.
 * @param nodeInstanceId
 * @param portInstanceId
 */
export const usePortValues = (nodeInstanceId: string, portInstanceId: string): NodePen.DataTree | null => {
  return useStore((state) => {
    const solutionValues = state.solution.nodeSolutionData.find((data) => data.nodeInstanceId === nodeInstanceId)?.portSolutionData.find((data) => data.portInstanceId === portInstanceId)?.dataTree
    const internalValues = state.document.nodes[nodeInstanceId]?.values[portInstanceId]

    return solutionValues ?? internalValues ?? null
  })
}
