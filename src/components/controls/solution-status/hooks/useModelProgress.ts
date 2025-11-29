import { useStore } from '$'
import type { ProgressStatus } from '../types'

export const useModelProgress = (): ProgressStatus => {
  const progress = useStore((state) => state.lifecycle.model.progress)

  const statusMessage = useStore((state) => {
    if (state.lifecycle.solution !== 'ready') {
      return 'Awaiting solution...'
    }

    const modelProgress = state.lifecycle.model.progress
    const objectCount = state.lifecycle.model.objectCount

    return modelProgress === 1 ? `Displaying ${objectCount} objects` : 'Downloading model...'
  })

  const statusLevel: ProgressStatus['statusLevel'] = useStore((state) => {
    if (state.lifecycle.solution !== 'ready') {
      return 'pending'
    }

    return state.lifecycle.model.progress === 1 ? 'normal' : 'pending'
  })

  return { progress, statusMessage, statusLevel }
}
