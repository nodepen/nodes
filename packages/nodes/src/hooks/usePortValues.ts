import type * as NodePen from '@nodepen/core'
import { useStore } from '$'

/**
 * Given a reference to a specific port, return its user-defined values or its current solution values.
 * @remarks Returns first value found, in that order, or `null` if none exist.
 * @param nodeInstanceId
 * @param portInstanceId
 */
export const usePortValues = (nodeInstanceId: string, portInstanceId: string): NodePen.DataTree | null => {
    const values = useStore((state) => {
        const node = state.document.nodes[nodeInstanceId]

        if (!node) {
            return null
        }

        const userValues = node.values[portInstanceId]

        if (userValues && Object.keys(userValues).length > 0) {
            return userValues
        }

        const solutionData = state.solution.values?.[nodeInstanceId]?.[portInstanceId]

        if (solutionData) {
            return solutionData
        }

        return null
    })

    return values
}