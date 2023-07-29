import { useStore } from '$'
import type { ProgressStatus } from '../types'

export const useModelProgress = (): ProgressStatus => {
  const progress = useStore((state) => state.lifecycle.model.progress)

  const statusMessage = progress === 1 ? 'Loading model...' : `Successfully loaded model.`

  const statusLevel: ProgressStatus['statusLevel'] = progress === 1 ? 'pending' : 'normal'

  return { progress, statusMessage, statusLevel }
}
