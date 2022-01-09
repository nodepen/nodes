import { useAppSelector } from '$'
import { graphSelectors } from '../graphSlice'

export const useGraphManifest = (): ReturnType<typeof graphSelectors['selectGraphManifest']> => {
  return useAppSelector(graphSelectors.selectGraphManifest)
}
