import type * as NodePen from '@/types'
import { useStore } from '$'

/**
 * Given a reference to a specific port, return its user-defined values or its current solution values.
 * @remarks Returns first value found, in that order, or `null` if none exist.
 * @param nodeInstanceId
 * @param portInstanceId
 */
export const usePortValues = (nodeInstanceId: string, portInstanceId: string): NodePen.DataTree | null => {
    return useStore((state) => {
        const solutionValues = state.solution.nodeSolutionData[nodeInstanceId]?.portSolutionData[portInstanceId]?.dataTree
        const internalValues = state.document.nodes[nodeInstanceId]?.values[portInstanceId]

        return solutionValues ?? internalValues ?? null
    })
}
