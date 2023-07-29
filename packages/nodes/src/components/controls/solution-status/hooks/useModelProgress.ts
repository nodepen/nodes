import { useStore } from '$'
import type { ProgressStatus } from '../types'

export const useModelProgress = (): ProgressStatus => {
  const progress = useStore((state) => state.lifecycle.model.progress)

  const statusMessage = useStore((state) => {
    if (state.lifecycle.solution !== 'ready') {
      return 'Awaiting solution...'
    }

    const modelProgress = state.lifecycle.model.progress

    return progress === 1 ? `Loaded model` : 'Downloading model...'
  })

  const statusLevel: ProgressStatus['statusLevel'] = progress === 1 ? 'pending' : 'normal'

  return { progress, statusMessage, statusLevel }
}
