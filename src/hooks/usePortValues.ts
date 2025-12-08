import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { useCallback, useEffect } from 'react'
import { useAsyncMemo } from '@/hooks'
import { useSpeckleObjectLoader } from '@/context'

type SolutionData = {
  SolutionId: string
  DocumentRuntimeData: {
    DurationMs: number
  }
  NodeSolutionData: {
    NodeInstanceId: string
    NodeRuntimeData: {
      DurationMs: number
    }
    PortSolutionData: {
      DataTree: {
        Stats: {
          BranchCount: number
          BranchValueCountDomain: [min: number, max: number]
          TreeStructure: 'single' | 'list' | 'tree'
          ValueCount: number
          ValueTypes: NodePen.DataTreeValueType[]
        }
        Branches: {
          Order: number
          Path: string
          Values: {
            Order: number
            Type: string
            Value: string
            Geometry: any | undefined
          }[]
        }[]
      }
      PortInstanceId: string
    }[]
  }[]
}

const lowerFirstLetterDeep = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(lowerFirstLetterDeep);
  }

  if (value && typeof value === "object" && value.constructor === Object) {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      const newKey = key.charAt(0).toLowerCase() + key.slice(1);
      result[newKey] = lowerFirstLetterDeep(val);
    }
    return result;
  }

  // primitives, dates, functions, etc.
  return value;
}

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

  const parameterValues = useStore((state) => {
    return state.document.nodes[nodeInstanceId].values[portInstanceId] ?? null
  })

  const objectLoader = useSpeckleObjectLoader()

  const getLatestValues = useCallback(async (): Promise<NodePen.DataTree | null> => {
    // Load result data
    if (!objectLoader) {
      console.log('🐍 Could not find object loader')
      return null
    }

    const rootObject = await objectLoader.getRootObject()
    const solutionData = rootObject?.base! as unknown as SolutionData

    const dataTree = solutionData.NodeSolutionData?.find((node) => node.NodeInstanceId === nodeInstanceId)?.PortSolutionData?.find((port) => port.PortInstanceId === portInstanceId)?.DataTree

    if (!dataTree) {
      return null
    }

    // TODO: This should serialize in camelCase...
    return lowerFirstLetterDeep(dataTree)
  }, [solutionId, nodeInstanceId, portInstanceId])

  const cacheKey = `${solutionId}:${solutionStatus}:${nodeInstanceId}:${portInstanceId}`

  const { value, isLoading: _isLoading } = useAsyncMemo(cacheKey, getLatestValues)

  const cacheValue = useStore.getState().cache.portSolutionData[cacheKey]

  // Cache value in store
  useEffect(() => {
    if (!value || solutionStatus === 'expired') {
      return
    }
    apply((state) => {
      state.cache.portSolutionData[cacheKey] = value
    })
  }, [value])


  const fallbackValues = solutionStatus === 'expired' ? null : cacheValue ?? value ?? null

  return parameterValues ?? fallbackValues
}
