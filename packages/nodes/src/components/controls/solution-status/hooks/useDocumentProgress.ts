import { useStore } from '$'
import { useMemo } from 'react'
import type { ProgressStatus } from '../types'

export const useDocumentProgress = (): ProgressStatus => {
  const progress = useStore((state) => {
    return state.lifecycle.solution === 'expired' ? 0 : 1
  })

  const nodeCount = useMemo(() => Object.keys(useStore.getState().document), [progress])

  const statusMessage =
    progress === 0
      ? `Solving ${nodeCount} nodes...`
      : `Solved ${nodeCount} nodes in ${useStore.getState().solution.documentRuntimeData.durationMs}ms.`

  const statusLevel: ProgressStatus['statusLevel'] = progress === 0 ? 'pending' : 'normal'

  return { progress, statusMessage, statusLevel }
}
