import { useAppSelector } from '$'
import { graphSelectors } from '../graphSlice'

export const useGraphFiles = (): ReturnType<typeof graphSelectors['selectGraphFiles']> => {
  return useAppSelector(graphSelectors.selectGraphFiles)
}
